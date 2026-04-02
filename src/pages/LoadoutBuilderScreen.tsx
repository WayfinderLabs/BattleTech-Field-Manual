import { useState, useCallback, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bookmark } from 'lucide-react';
import type { Mech } from '@/data/mechs';
import { MECHS } from '@/data/mechs';
import type { Weapon } from '@/data/weapons';
import type { LoadoutState, LocationKey, HardpointType, SlotItem } from '@/types/loadout';
import { LOCATION_LABELS, EMPTY_SLOTS, EMPTY_EQUIPMENT } from '@/types/loadout';
import { parseHardpoints } from '@/utils/parseHardpoints';
import { validateLoadout, wouldCreateNewError } from '@/utils/validateLoadout';
import type { ValidationResult } from '@/utils/validateLoadout';
import { useSavedLoadouts } from '@/hooks/useSavedLoadouts';
import MechPickerSheet from '@/components/loadout/MechPickerSheet';
import UnifiedWeaponPicker from '@/components/loadout/UnifiedWeaponPicker';
import LocationCard from '@/components/loadout/LocationCard';
import StatsBar from '@/components/loadout/StatsBar';
import ValidationPanel from '@/components/loadout/ValidationPanel';
import BlockingDialog from '@/components/loadout/BlockingDialog';
import SaveLoadoutSheet from '@/components/loadout/SaveLoadoutSheet';

const LOCATION_KEYS: LocationKey[] = ['hd', 'ct', 'lt', 'rt', 'la', 'ra', 'll', 'rl'];

const LoadoutBuilderScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { saveLoadout, overwriteLoadout, getDuplicateByName } = useSavedLoadouts();

  const [state, setState] = useState<LoadoutState>({
    selectedMech: null,
    slots: { ...EMPTY_SLOTS },
    equipment: { ...EMPTY_EQUIPMENT },
  });

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

  // Restore from saved loadout navigation
  useEffect(() => {
    const navState = location.state as { restoreLoadout?: any } | null;
    if (navState?.restoreLoadout) {
      const saved = navState.restoreLoadout;
      const mech = MECHS.find(m => m.id.toString() === saved.mechId);
      if (mech) {
        // Rebuild slots from saved data - re-parse hardpoints and restore weapons
        const newSlots = { ...EMPTY_SLOTS } as Record<LocationKey, ReturnType<typeof parseHardpoints>>;
        for (const key of LOCATION_KEYS) {
          const parsed = parseHardpoints(mech.hardpoints[key]);
          // Restore saved weapons into parsed slots
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
      }
      // Clear the navigation state so refreshing doesn't re-restore
      navigate('/loadout', { replace: true, state: {} });
    }
  }, []);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  // Toast auto-dismiss
  useEffect(() => {
    if (!toastMessage) return;
    const t = setTimeout(() => setToastMessage(null), 2500);
    return () => clearTimeout(t);
  }, [toastMessage]);

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
    const result = saveLoadout(name, notes, state.selectedMech.id.toString(), state.slots, state.equipment);
    if (result === 'saved') {
      setToastMessage('LOADOUT SAVED');
    }
    return result;
  };

  const handleOverwrite = (existingId: string, name: string, notes: string | undefined) => {
    if (!state.selectedMech) return;
    overwriteLoadout(existingId, name, notes, state.selectedMech.id.toString(), state.slots, state.equipment);
    setToastMessage('LOADOUT SAVED');
  };

  const handleGetDuplicate = (name: string) => {
    const dup = getDuplicateByName(name);
    return dup ? { id: dup.id, name: dup.name } : undefined;
  };

  const { selectedMech } = state;
  const hasOverweight = validation.some(v => v.code === 'OVERWEIGHT');

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

      {/* Header with bookmark icon */}
      <div className="flex items-center justify-between">
        <h1 className="font-mono uppercase tracking-wider text-primary font-bold" style={{ fontSize: 'var(--fs-heading)' }}>
          LOADOUT BUILDER
        </h1>
        <button
          onClick={() => navigate('/saved-loadouts')}
          className="text-muted-foreground hover:text-primary transition-colors p-1"
        >
          <Bookmark className="w-5 h-5" />
        </button>
      </div>

      {/* Mech Selection Panel */}
      <div className="border border-border rounded-sm p-4 bg-card">
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
                <span className="text-primary">{selectedMech.tonnage}T</span>
                <span>{selectedMech.topSpeed} km/h</span>
                <span>JJ: {selectedMech.jumpJetsMax}</span>
              </div>
            </div>
            <button
              onClick={() => setMechPickerOpen(true)}
              className="font-mono uppercase tracking-wider text-muted-foreground border border-border rounded-sm px-2 py-1 hover:text-foreground transition-colors shrink-0"
              style={{ fontSize: 'var(--fs-badge)' }}
            >
              CHANGE
            </button>
          </div>
        )}
      </div>

      {/* Stats Bar */}
      {selectedMech && <StatsBar state={state} hasOverweight={hasOverweight} />}

      {/* Validation Panel */}
      {selectedMech && <ValidationPanel results={validation} />}

      {/* Hardpoint Grid */}
      {selectedMech && (() => {
        // Compute global ammo bin counts by ammoType
        const ammoBinCounts: Record<string, number> = {};
        for (const loc of LOCATION_KEYS) {
          for (const eq of state.equipment[loc]) {
            if (eq.item && eq.item.kind === 'ammo') {
              const ammoId = (eq.item.data as any).ammoId as string;
              ammoBinCounts[ammoId] = (ammoBinCounts[ammoId] ?? 0) + 1;
            }
          }
        }
        return (
          <div className="grid grid-cols-2 gap-2">
            {LOCATION_KEYS.map((loc) => (
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
                ammoBinCounts={ammoBinCounts}
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
    </div>
  );
};

export default LoadoutBuilderScreen;
