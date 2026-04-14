import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { useLoadoutDirty } from '@/contexts/LoadoutDirtyContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bookmark, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import type { HeatSink } from '@/data/loadoutEquipment';
import type { Mech } from '@/data/mechs';
import { MECHS } from '@/data/mechs';
import type { Weapon } from '@/data/weapons';
import type { LoadoutState, LocationKey, HardpointType, SlotItem, SlotAssignment, EquipmentSlot } from '@/types/loadout';
import { LOCATION_LABELS, EMPTY_SLOTS, EMPTY_EQUIPMENT } from '@/types/loadout';
import { parseHardpoints } from '@/utils/parseHardpoints';
import { validateLoadout, wouldCreateNewError } from '@/utils/validateLoadout';
import type { ValidationResult } from '@/utils/validateLoadout';
import { useSavedLoadouts } from '@/hooks/useSavedLoadouts';
import type { SavedLoadout } from '@/types/savedLoadout';
import MechPickerSheet from '@/components/loadout/MechPickerSheet';
import UnifiedWeaponPicker from '@/components/loadout/UnifiedWeaponPicker';
import LocationCard from '@/components/loadout/LocationCard';
import StatsBar from '@/components/loadout/StatsBar';
import ValidationPanel from '@/components/loadout/ValidationPanel';
import BlockingDialog from '@/components/loadout/BlockingDialog';
import SaveLoadoutSheet from '@/components/loadout/SaveLoadoutSheet';

const LOCATION_KEYS: LocationKey[] = ['hd', 'ct', 'lt', 'rt', 'la', 'ra', 'll', 'rl'];
const DISPLAY_ORDER: LocationKey[] = ['hd', 'ct', 'rt', 'lt', 'ra', 'la', 'rl', 'll'];

/** Deep-compare slot assignments (weapon content only) */
function slotsMatch(
  current: Record<string, SlotAssignment[]>,
  saved: Record<string, SlotAssignment[]>,
): boolean {
  for (const loc of LOCATION_KEYS) {
    const cur = current[loc] ?? [];
    const sav = saved[loc] ?? [];
    if (cur.length !== sav.length) return false;
    for (let i = 0; i < cur.length; i++) {
      const cw = cur[i]?.weapon;
      const sw = sav[i]?.weapon;
      if (cw === null && sw === null) continue;
      if (cw === null || sw === null) return false;
      // Compare all weapon properties
      if (cw.id !== sw.id) return false;
      if (cw.name !== sw.name) return false;
      if (cw.tonnage !== sw.tonnage) return false;
      if (cw.damage !== sw.damage) return false;
      if (cw.heat !== sw.heat) return false;
      if (cw.criticalSlots !== sw.criticalSlots) return false;
    }
  }
  return true;
}

/** Deep-compare equipment slots */
function equipmentMatch(
  current: Record<string, EquipmentSlot[]>,
  saved: Record<string, EquipmentSlot[]>,
): boolean {
  for (const loc of LOCATION_KEYS) {
    const cur = current[loc] ?? [];
    const sav = saved[loc] ?? [];
    if (cur.length !== sav.length) return false;
    for (let i = 0; i < cur.length; i++) {
      const ci = cur[i]?.item;
      const si = sav[i]?.item;
      if (ci === null && si === null) continue;
      if (ci === null || si === null) return false;
      if (ci.kind !== si.kind) return false;
      if (ci.data.id !== si.data.id) return false;
      if (cur[i].slotsUsed !== sav[i].slotsUsed) return false;
    }
  }
  return true;
}

/** Check if current loadout exactly matches any saved entry */
function matchesSavedLoadout(
  mechId: string,
  slots: Record<string, SlotAssignment[]>,
  equipment: Record<string, EquipmentSlot[]>,
  armor: number,
  loadoutName: string,
  loadoutNotes: string,
  savedLoadouts: SavedLoadout[],
): boolean {
  return savedLoadouts.some(saved => {
    if (saved.mechId !== mechId) return false;
    if ((saved.armorPoints ?? 0) !== armor) return false;
    if (saved.name.trim().toLowerCase() !== loadoutName.trim().toLowerCase()) return false;
    const savedNotes = saved.notes?.trim() || '';
    if (savedNotes !== loadoutNotes.trim()) return false;
    if (!slotsMatch(slots, saved.slots)) return false;
    if (!equipmentMatch(equipment, saved.equipment)) return false;
    return true;
  });
}

const LoadoutBuilderScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { savedLoadouts, saveLoadout, overwriteLoadout, getDuplicateByName } = useSavedLoadouts();

  const [state, setState] = useState<LoadoutState>({
    selectedMech: null,
    slots: { ...EMPTY_SLOTS },
    equipment: { ...EMPTY_EQUIPMENT },
  });
  const [armorPoints, setArmorPoints] = useState(0);
  const [editingArmor, setEditingArmor] = useState(false);
  const [armorInputValue, setArmorInputValue] = useState('');
  const armorInputRef = useRef<HTMLInputElement>(null);

  const [mechPickerOpen, setMechPickerOpen] = useState(false);
  const [pickerLocation, setPickerLocation] = useState<LocationKey | null>(null);
  const [saveSheetOpen, setSaveSheetOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [blockingDialog, setBlockingDialog] = useState<{
    isOpen: boolean;
    itemName: string;
    locationKey: string;
    reason: 'OVERWEIGHT' | 'CRIT_OVERFLOW';
  } | null>(null);
  const [unsavedGuardAction, setUnsavedGuardAction] = useState<(() => void) | null>(null);
  const [loadedName, setLoadedName] = useState('');
  const [loadedNotes, setLoadedNotes] = useState('');

  const isDirty = useMemo(() => {
    // Check if loadout has any content at all
    let hasContent = armorPoints > 0;
    if (!hasContent) {
      for (const loc of LOCATION_KEYS) {
        for (const s of state.slots[loc]) {
          if (s.weapon) { hasContent = true; break; }
        }
        if (hasContent) break;
        for (const eq of state.equipment[loc]) {
          if (eq.item) { hasContent = true; break; }
        }
        if (hasContent) break;
      }
    }
    if (!hasContent) return false;

    // Check if current state exactly matches a saved entry
    if (state.selectedMech && matchesSavedLoadout(
      state.selectedMech.id.toString(),
      state.slots,
      state.equipment,
      armorPoints,
      loadedName,
      loadedNotes,
      savedLoadouts,
    )) {
      return false;
    }

    return true;
  }, [state, armorPoints, loadedName, loadedNotes, savedLoadouts]);

  const guardedNavigate = useCallback((action: () => void) => {
    if (isDirty) {
      setUnsavedGuardAction(() => action);
    } else {
      action();
    }
  }, [isDirty]);

  const { registerGuard } = useLoadoutDirty();

  useEffect(() => {
    registerGuard(guardedNavigate);
    return () => registerGuard(null);
  }, [guardedNavigate, registerGuard]);

  // Restore from saved loadout navigation
  useEffect(() => {
    const navState = location.state as { restoreLoadout?: any } | null;
    if (navState?.restoreLoadout) {
      const saved = navState.restoreLoadout;
      const mech = MECHS.find(m => m.id.toString() === saved.mechId);
      if (mech) {
        const newSlots = { ...EMPTY_SLOTS } as Record<LocationKey, ReturnType<typeof parseHardpoints>>;
        for (const key of LOCATION_KEYS) {
          const parsed = parseHardpoints(mech.hardpoints[key]);
          if (saved.slots[key]) {
            for (let i = 0; i < parsed.length && i < saved.slots[key].length; i++) {
              if (saved.slots[key][i]?.weapon) {
                parsed[i] = { ...parsed[i], weapon: saved.slots[key][i].weapon };
              }
            }
          }
          newSlots[key] = parsed;
        }
        setState({
          selectedMech: mech,
          slots: newSlots,
          equipment: saved.equipment || { ...EMPTY_EQUIPMENT },
        });
        // Restore armor: use saved value if present, otherwise default to mech maxArmor
        const restoredArmor = typeof saved.armorPoints === 'number' ? saved.armorPoints : mech.maxArmor;
        setArmorPoints(restoredArmor);
        setLoadedName(saved.name || '');
        setLoadedNotes(saved.notes || '');
      }
    navigate('/loadout', { replace: true, state: {} });
    }
  }, []);

  // Restore draft from localStorage on mount (only if no restoreLoadout nav state)
  useEffect(() => {
    const navState = location.state as { restoreLoadout?: any } | null;
    if (navState?.restoreLoadout) return;

    try {
      const raw = localStorage.getItem('btfm_draft_loadout');
      if (!raw) return;
      const draft = JSON.parse(raw);
      const mech = MECHS.find(m => m.id.toString() === draft.mechId);
      if (!mech) return;
      const newSlots = { ...EMPTY_SLOTS } as Record<LocationKey, ReturnType<typeof parseHardpoints>>;
      for (const key of LOCATION_KEYS) {
        const parsed = parseHardpoints(mech.hardpoints[key]);
        if (draft.slots[key]) {
          for (let i = 0; i < parsed.length && i < draft.slots[key].length; i++) {
            if (draft.slots[key][i]?.weapon) {
              parsed[i] = { ...parsed[i], weapon: draft.slots[key][i].weapon };
            }
          }
        }
        newSlots[key] = parsed;
      }
      setState({
        selectedMech: mech,
        slots: newSlots,
        equipment: draft.equipment || { ...EMPTY_EQUIPMENT },
      });
      if (typeof draft.armorPoints === 'number') {
        setArmorPoints(draft.armorPoints);
      }
    } catch {}
  }, []);

  // Persist draft to localStorage on every state change
  useEffect(() => {
    if (!state.selectedMech) {
      localStorage.removeItem('btfm_draft_loadout');
      return;
    }
    try {
      const draft = {
        mechId: state.selectedMech.id.toString(),
        slots: state.slots,
        equipment: state.equipment,
        armorPoints,
      };
      localStorage.setItem('btfm_draft_loadout', JSON.stringify(draft));
    } catch {}
  }, [state, armorPoints]);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  // Toast auto-dismiss
  useEffect(() => {
    if (!toastMessage) return;
    const t = setTimeout(() => setToastMessage(null), 2500);
    return () => clearTimeout(t);
  }, [toastMessage]);

  // Focus armor input when editing
  useEffect(() => {
    if (editingArmor) {
      setTimeout(() => armorInputRef.current?.focus(), 50);
    }
  }, [editingArmor]);

  const validation = useMemo<ValidationResult[]>(() => {
    if (!state.selectedMech) return [];
    return validateLoadout(state.selectedMech, state);
  }, [state]);

  const handleSelectMech = useCallback((mech: Mech) => {
    const newSlots = { ...EMPTY_SLOTS } as Record<LocationKey, ReturnType<typeof parseHardpoints>>;
    for (const key of LOCATION_KEYS) {
      newSlots[key] = parseHardpoints(mech.hardpoints[key]);
    }
    setState({ selectedMech: mech, slots: newSlots, equipment: { ...EMPTY_EQUIPMENT } });
    setArmorPoints(0);
  }, []);

  const handleWeaponAdd = useCallback((weapon: Weapon, slotIndex: number) => {
    if (!pickerLocation || !state.selectedMech) return;

    const check = wouldCreateNewError(
      { kind: 'weapon', data: weapon },
      pickerLocation,
      state.selectedMech,
      state,
      validation
    );
    if (check.blocked && check.reason) {
      setBlockingDialog({
        isOpen: true,
        itemName: weapon.name,
        locationKey: pickerLocation,
        reason: check.reason,
      });
      return;
    }

    setState((prev) => {
      const locSlots = [...prev.slots[pickerLocation]];
      locSlots[slotIndex] = { ...locSlots[slotIndex], weapon };
      const newState = { ...prev, slots: { ...prev.slots, [pickerLocation]: locSlots } };

      const allFull = newState.slots[pickerLocation].every(s => !!s.weapon);
      if (allFull) {
        setTimeout(() => setPickerLocation(null), 0);
      }

      return newState;
    });
  }, [pickerLocation, state, validation]);

  const handleEquipmentAdd = useCallback((item: SlotItem, loc: LocationKey) => {
    if (!state.selectedMech) return;

    const check = wouldCreateNewError(item, loc, state.selectedMech, state, validation);
    if (check.blocked && check.reason) {
      const name = item.data.name;
      setBlockingDialog({
        isOpen: true,
        itemName: name,
        locationKey: loc,
        reason: check.reason,
      });
      return;
    }

    const slotsUsed = item.kind === 'weapon' ? item.data.criticalSlots : item.data.slots;
    setState((prev) => {
      const locEquip = [...prev.equipment[loc], { item, slotsUsed }];
      const newState = { ...prev, equipment: { ...prev.equipment, [loc]: locEquip } };
      return newState;
    });
  }, [state, validation]);

  const handleRemoveWeapon = useCallback((location: LocationKey, slotIndex: number) => {
    setState((prev) => {
      const locSlots = [...prev.slots[location]];
      locSlots[slotIndex] = { ...locSlots[slotIndex], weapon: null };
      return { ...prev, slots: { ...prev.slots, [location]: locSlots } };
    });
  }, []);

  const handleRemoveEquipment = useCallback((location: LocationKey, equipIndex: number) => {
    setState((prev) => {
      const locEquip = [...prev.equipment[location]];
      locEquip.splice(equipIndex, 1);
      return { ...prev, equipment: { ...prev.equipment, [location]: locEquip } };
    });
  }, []);

  const handleSave = (name: string, notes: string | undefined): 'saved' | 'duplicate_name' => {
    if (!state.selectedMech) return 'saved';
    const result = saveLoadout(name, notes, state.selectedMech.id.toString(), state.slots, state.equipment, armorPoints);
    if (result === 'saved') {
      setLoadedName(name);
      setLoadedNotes(notes?.trim() || '');
      setToastMessage('LOADOUT SAVED');
    }
    return result;
  };

  const handleOverwrite = (existingId: string, name: string, notes: string | undefined) => {
    if (!state.selectedMech) return;
    overwriteLoadout(existingId, name, notes, state.selectedMech.id.toString(), state.slots, state.equipment, armorPoints);
    setToastMessage('LOADOUT SAVED');
  };

  const handleGetDuplicate = (name: string) => {
    const dup = getDuplicateByName(name);
    return dup ? { id: dup.id, name: dup.name } : undefined;
  };

  const handleArmorInputCommit = () => {
    if (!selectedMech) return;
    const parsed = parseInt(armorInputValue, 10);
    if (isNaN(parsed)) {
      setEditingArmor(false);
      return;
    }
    const clamped = Math.max(0, Math.min(selectedMech.maxArmor, parsed));
    setArmorPoints(clamped);
    setEditingArmor(false);
  };

  const handleStripArmor = () => {
    setArmorPoints(0);
  };

  const handleStripEquipment = () => {
    setState((prev) => {
      if (!prev.selectedMech) return prev;
      // Clear all weapons from slots (keep hardpoint structure)
      const newSlots = { ...prev.slots };
      for (const loc of LOCATION_KEYS) {
        newSlots[loc] = prev.slots[loc].map(s => ({ ...s, weapon: null }));
      }
      return {
        ...prev,
        slots: newSlots,
        equipment: { ...EMPTY_EQUIPMENT },
      };
    });
  };

  const { selectedMech } = state;
  const hasOverweight = validation.some(v => v.code === 'OVERWEIGHT');

  const buildShareText = () => {
    if (!selectedMech) return '';
    // Compute stats for share
    let tonnageUsed = armorPoints * 0.0125;
    let rawHeat = 0;
    let shareDissipation = selectedMech.baseHeatDissipation;
    let totalDamage = 0;
    let jumpJetCount = 0;
    let totalMaxHeatBonus = 0;
    let reductionMultiplier = 1;
    const BASE_MAX_HEAT = 100;

    for (const loc of LOCATION_KEYS) {
      for (const s of state.slots[loc]) {
        if (s.weapon) {
          tonnageUsed += s.weapon.tonnage;
          rawHeat += s.weapon.heat;
          totalDamage += s.weapon.damage;
        }
      }
      for (const eq of state.equipment[loc]) {
        if (eq.item) {
          tonnageUsed += eq.item.data.tonnage;
          if (eq.item.kind === 'heatSink') {
            const hs = eq.item.data as HeatSink;
            if (hs.subType === 'Standard') shareDissipation += hs.dissipation;
            if (hs.maxHeatBonus) totalMaxHeatBonus += hs.maxHeatBonus;
            if (hs.heatReductionPct) reductionMultiplier *= (1 - hs.heatReductionPct / 100);
          }
          if (eq.item.kind === 'jumpJet') jumpJetCount++;
        }
      }
    }

    const adjustedHeat = Math.floor(rawHeat * reductionMultiplier);
    const shutdown = BASE_MAX_HEAT + totalMaxHeatBonus;
    const availableTonnage = selectedMech.tonnage - selectedMech.initialTonnage;
    const jjMax = selectedMech.jumpJetsMax;

    // Engagement range
    const equippedWeapons = LOCATION_KEYS
      .flatMap(loc => state.slots[loc])
      .map(s => s.weapon)
      .filter((w): w is NonNullable<typeof w> => w !== null && w !== undefined);
    let engagementStr = '—';
    if (equippedWeapons.length > 0) {
      const lowBound = Math.max(...equippedWeapons.map(w => w.shortRange));
      const highBound = Math.min(...equippedWeapons.map(w => w.longRange));
      engagementStr = lowBound < highBound ? `${lowBound}–${highBound}m` : 'NO OVERLAP';
    }

    // Per-location items
    const locationLines = LOCATION_KEYS.map(loc => {
      const label = LOCATION_LABELS[loc];
      const items: string[] = [];
      for (const s of state.slots[loc]) {
        if (s.weapon) items.push(s.weapon.name);
      }
      for (const eq of state.equipment[loc]) {
        if (eq.item) items.push(eq.item.data.name);
      }
      return `${label}: ${items.length > 0 ? items.join(', ') : '—'}`;
    });

    const lines = [
      `${selectedMech.name} (${selectedMech.variant}) — Custom Loadout`,
      `Tonnage Used: ${tonnageUsed}t / ${availableTonnage}t`,
      `Armor: ${armorPoints} / ${selectedMech.maxArmor}`,
      `Damage Output: ${Math.floor(totalDamage)}`,
      `Heat / Dissipation: ${adjustedHeat} / ${shareDissipation}`,
      `Shutdown Risk: ${shutdown}%`,
      `Jump Jets: ${jumpJetCount} / ${jjMax}`,
      `Engagement Range: ${engagementStr}`,
      '',
      'Loadout:',
      ...locationLines,
      '',
      '[placeholder: App store link coming soon]',
      '— Shared via BattleTech Field Manual',
    ];
    return lines.join('\n');
  };

  const handleShare = async () => {
    if (!selectedMech) return;
    const text = buildShareText();
    const title = `${selectedMech.name} — Loadout`;
    if (navigator.share) {
      try {
        await navigator.share({ title, text });
      } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(text);
        toast("Copied to clipboard — ready for sharing!", {
          style: { background: "#1a1a1a", color: "#C87941", fontFamily: "monospace", border: "1px solid #2a2a2a" },
        });
      } catch {}
    }
  };

  return (
    <div className="space-y-4">
      {/* Toast notification */}
      {toastMessage && (
        <div
          className="fixed top-2 left-1/2 -translate-x-1/2 z-[100] px-4 py-2 rounded-sm font-mono uppercase tracking-wider text-primary-foreground"
          style={{ backgroundColor: '#C87941', fontSize: 'var(--fs-body)' }}
        >
          {toastMessage}
        </div>
      )}

      {/* Sticky header block */}
      <div className="sticky top-0 z-40 -mx-4 px-4" style={{ background: '#0D0D0D', borderBottom: '1px solid #2a2a2a' }}>
        {/* ROW 1 — Title bar */}
        <div className="flex items-center justify-between h-11 min-h-[44px]">
          <span className="text-sm font-mono uppercase tracking-widest text-primary font-bold">
            LOADOUT BUILDER
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => guardedNavigate(() => navigate('/saved-loadouts'))}
              className="text-muted-foreground hover:text-primary transition-colors p-1"
            >
              <Bookmark className="w-5 h-5" />
            </button>
            <button
              onClick={handleShare}
              disabled={!selectedMech}
              className="p-1 active:scale-[0.97] disabled:opacity-40"
              aria-label="Share"
            >
              <Share2 className="h-5 w-5" style={{ color: '#8A8A8A' }} />
            </button>
          </div>
        </div>

        {/* ROW 2 — Mech selector card */}
        <div className="border border-border rounded-sm p-4 bg-card mb-0">
          <div className="font-mono uppercase tracking-wider text-primary mb-3" style={{ fontSize: 'var(--fs-body)' }}>
            SELECT MECH
          </div>

          {!selectedMech ? (
            <button
              onClick={() => setMechPickerOpen(true)}
              className="w-full border border-primary text-primary font-mono uppercase tracking-wider py-3 rounded-sm hover:bg-primary/10 transition-colors"
              style={{ fontSize: 'var(--fs-body)' }}
            >
              [ TAP TO SELECT MECH ]
            </button>
          ) : (
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="font-mono uppercase tracking-wider text-primary font-semibold" style={{ fontSize: 'var(--fs-card-title)' }}>
                  {selectedMech.name}
                </div>
                <div className="font-mono text-muted-foreground" style={{ fontSize: 'var(--fs-badge)' }}>
                  {selectedMech.variant}
                </div>
                <div className="flex gap-3 mt-2 font-mono text-muted-foreground flex-wrap" style={{ fontSize: 'var(--fs-badge)' }}>
                  <span>{selectedMech.chassisClass}</span>
                  <span className="text-primary">{selectedMech.tonnage - selectedMech.initialTonnage}t free / {selectedMech.tonnage}T</span>
                  <span>{selectedMech.topSpeed} km/h</span>
                  <span>JJ: {selectedMech.jumpJetsMax}</span>
                </div>
              </div>
              <button
                onClick={() => guardedNavigate(() => setMechPickerOpen(true))}
                className="font-mono uppercase tracking-wider text-muted-foreground border border-border rounded-sm px-2 py-1 hover:text-foreground transition-colors shrink-0"
                style={{ fontSize: 'var(--fs-badge)' }}
              >
                CHANGE
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Armor Row */}
      {selectedMech && (() => {
        let usedTons = 0;
        const allLocs = Object.keys(state.slots) as LocationKey[];
        for (const loc of allLocs) {
          for (const s of state.slots[loc]) {
            if (s.weapon) usedTons += s.weapon.tonnage;
          }
          for (const eq of state.equipment[loc]) {
            if (eq.item) usedTons += eq.item.data.tonnage;
          }
        }
        const availableTonnage = selectedMech.tonnage - selectedMech.initialTonnage;
        const freeTons = availableTonnage - usedTons;
        const handleMaxArmor = () => {
          const maxAffordablePoints = Math.floor(Math.max(0, freeTons) / 0.0125);
          const capped = Math.min(selectedMech.maxArmor, maxAffordablePoints);
          const snapped = Math.floor(capped / 5) * 5;
          setArmorPoints(snapped);
        };
        const isMaxed = armorPoints === selectedMech.maxArmor;
        return (
          <div className="border border-border rounded-sm px-4 py-2 bg-card flex items-center justify-between">
            <div className="font-mono" style={{ fontSize: 'var(--fs-badge)' }}>
              <span className="uppercase tracking-wider" style={{ color: '#8A8A8A' }}>ARMOR </span>
              {editingArmor ? (
                <input
                  ref={armorInputRef}
                  type="number"
                  min={0}
                  max={selectedMech.maxArmor}
                  value={armorInputValue}
                  onChange={(e) => setArmorInputValue(e.target.value)}
                  onBlur={handleArmorInputCommit}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleArmorInputCommit(); }}
                  className="font-mono w-16 text-center rounded-sm px-1 py-0.5"
                  style={{
                    backgroundColor: '#161616',
                    border: '1px solid #2A2A2A',
                    color: '#C87941',
                    fontSize: 'var(--fs-badge)',
                    outline: 'none',
                  }}
                />
              ) : (
                <span
                  onClick={() => {
                    setArmorInputValue(armorPoints.toString());
                    setEditingArmor(true);
                  }}
                  style={{ color: '#C87941', cursor: 'pointer', textDecoration: 'underline', textDecorationStyle: 'dotted', textUnderlineOffset: '3px' }}
                >
                  {armorPoints}
                </span>
              )}
              <span style={{ color: '#8A8A8A' }}> / {selectedMech.maxArmor}</span>
              <div className="font-mono" style={{ fontSize: '11px', color: '#8A8A8A' }}>
                {Math.round((armorPoints / selectedMech.maxArmor) * 100)}% of max armor
              </div>
            </div>
            <button
              onClick={handleMaxArmor}
              className="font-mono uppercase tracking-wider rounded-sm px-2 py-1 bg-transparent"
              style={{
                fontSize: 'var(--fs-badge)',
                color: '#C87941',
                border: '1px solid #C87941',
                opacity: 1,
              }}
            >
              MAX ARMOR
            </button>
          </div>
        );
      })()}

      {/* Stats Bar */}
      {selectedMech && <StatsBar state={state} armorPoints={armorPoints} />}

      {/* Strip Buttons */}
      {selectedMech && (
        <div className="flex w-full gap-2">
          <button
            onClick={handleStripArmor}
            className="flex-1 font-mono uppercase tracking-wider rounded-sm px-2 py-1"
            style={{ fontSize: 'var(--fs-badge)', color: '#8A8A8A', border: '1px solid #2A2A2A', background: 'transparent' }}
          >
            STRIP ARMOUR
          </button>
          <button
            onClick={handleStripEquipment}
            className="flex-1 font-mono uppercase tracking-wider rounded-sm px-2 py-1"
            style={{ fontSize: 'var(--fs-badge)', color: '#8A8A8A', border: '1px solid #2A2A2A', background: 'transparent' }}
          >
            STRIP EQUIPMENT
          </button>
        </div>
      )}

      {/* Validation Panel */}
      {selectedMech && <ValidationPanel results={validation} />}

      {/* Hardpoint Grid */}
      {selectedMech && (() => {
        const ammoBinCapacity: Record<string, number> = {};
        const ammoWeaponCounts: Record<string, number> = {};
        for (const loc of LOCATION_KEYS) {
          for (const eq of state.equipment[loc]) {
            if (eq.item && eq.item.kind === 'ammo') {
              const ammoId = (eq.item.data as any).ammoId as string;
              const capacity = (eq.item.data as any).capacity as number ?? 0;
              if (ammoId) ammoBinCapacity[ammoId] = (ammoBinCapacity[ammoId] ?? 0) + capacity;
            }
          }
          for (const s of state.slots[loc]) {
            if (s.weapon?.ammoType) {
              ammoWeaponCounts[s.weapon.ammoType] = (ammoWeaponCounts[s.weapon.ammoType] ?? 0) + 1;
            }
          }
        }
        return (
          <div className="grid grid-cols-2 gap-2">
            {DISPLAY_ORDER.map((loc) => (
              <LocationCard
                key={loc}
                label={LOCATION_LABELS[loc]}
                hardpointStr={selectedMech.hardpoints[loc]}
                slots={state.slots[loc]}
                equipment={state.equipment[loc]}
                inventorySlots={selectedMech.inventorySlots[loc]}
                onOpenPicker={() => setPickerLocation(loc)}
                onRemoveWeapon={(slotIndex) => handleRemoveWeapon(loc, slotIndex)}
                onRemoveEquipment={(equipIndex) => handleRemoveEquipment(loc, equipIndex)}
                hasCritOverflow={validation.some(v => v.code === 'CRIT_OVERFLOW' && v.locationKey === loc)}
                ammoBinCapacity={ammoBinCapacity}
                ammoWeaponCounts={ammoWeaponCounts}
              />
            ))}
          </div>
        );
      })()}

      {/* Save Loadout Button */}
      <button
        onClick={() => setSaveSheetOpen(true)}
        disabled={!selectedMech}
        className="w-full font-mono uppercase tracking-wider text-primary-foreground bg-primary rounded-sm min-h-[44px] py-2.5 hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ fontSize: 'var(--fs-body)' }}
      >
        SAVE LOADOUT
      </button>

      {/* Mech Picker */}
      <MechPickerSheet
        open={mechPickerOpen}
        onClose={() => setMechPickerOpen(false)}
        onSelect={handleSelectMech}
      />

      {/* Unified Item Picker */}
      {pickerLocation && selectedMech && (
        <UnifiedWeaponPicker
          open={!!pickerLocation}
          locationKey={pickerLocation}
          slots={state.slots[pickerLocation]}
          equipment={state.equipment[pickerLocation]}
          inventorySlots={selectedMech.inventorySlots[pickerLocation]}
          mech={selectedMech}
          allEquipment={state.equipment}
          onClose={() => setPickerLocation(null)}
          onAddWeapon={handleWeaponAdd}
          onAddEquipment={(item) => handleEquipmentAdd(item, pickerLocation)}
        />
      )}

      {/* Blocking Dialog */}
      {blockingDialog && (
        <BlockingDialog
          isOpen={blockingDialog.isOpen}
          weaponName={blockingDialog.itemName}
          mechName={selectedMech?.name ?? ''}
          locationKey={blockingDialog.locationKey}
          reason={blockingDialog.reason}
          onClose={() => setBlockingDialog(null)}
        />
      )}

      {/* Save Loadout Sheet */}
      <SaveLoadoutSheet
        open={saveSheetOpen}
        onClose={() => setSaveSheetOpen(false)}
        onSave={handleSave}
        onOverwrite={handleOverwrite}
        getDuplicateId={handleGetDuplicate}
      />

      {/* Unsaved Changes Guard Dialog */}
      {unsavedGuardAction && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            backgroundColor: 'rgba(0,0,0,0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => setUnsavedGuardAction(null)}
        >
          <div
            style={{
              backgroundColor: '#161616',
              border: '1px solid #2A2A2A',
              maxWidth: '340px',
              width: '90%',
              padding: '24px',
              borderRadius: '0',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="font-mono uppercase tracking-wider"
              style={{ color: '#C87941', fontSize: 'var(--fs-badge)', marginBottom: '12px' }}
            >
              UNSAVED LOADOUT
            </div>
            <div
              className="font-mono"
              style={{ color: '#8A8A8A', fontSize: 'var(--fs-badge)', marginBottom: '20px' }}
            >
              You have weapons or equipment assigned. Your build will still be here when you return.
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setUnsavedGuardAction(null)}
                className="font-mono uppercase tracking-wider"
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: '1px solid #2A2A2A',
                  color: '#8A8A8A',
                  padding: '10px',
                  minHeight: '44px',
                  fontSize: 'var(--fs-badge)',
                  cursor: 'pointer',
                }}
              >
                STAY
              </button>
              <button
                onClick={() => {
                  const action = unsavedGuardAction;
                  setUnsavedGuardAction(null);
                  action();
                }}
                className="font-mono uppercase tracking-wider"
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: '1px solid #C87941',
                  color: '#C87941',
                  padding: '10px',
                  minHeight: '44px',
                  fontSize: 'var(--fs-badge)',
                  cursor: 'pointer',
                }}
              >
                LEAVE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoadoutBuilderScreen;
