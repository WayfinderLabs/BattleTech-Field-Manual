import { useState, useCallback, useEffect } from 'react';
import type { Mech } from '@/data/mechs';
import type { Weapon } from '@/data/weapons';
import type { LoadoutState, LocationKey, HardpointType } from '@/types/loadout';
import { LOCATION_LABELS, EMPTY_SLOTS } from '@/types/loadout';
import { parseHardpoints } from '@/utils/parseHardpoints';
import { validateLoadout, wouldCreateNewError } from '@/utils/validateLoadout';
import type { ValidationResult } from '@/utils/validateLoadout';
import MechPickerSheet from '@/components/loadout/MechPickerSheet';
import UnifiedWeaponPicker from '@/components/loadout/UnifiedWeaponPicker';
import LocationCard from '@/components/loadout/LocationCard';
import StatsBar from '@/components/loadout/StatsBar';
import ValidationPanel from '@/components/loadout/ValidationPanel';
import BlockingDialog from '@/components/loadout/BlockingDialog';

const LOCATION_KEYS: LocationKey[] = ['hd', 'ct', 'lt', 'rt', 'la', 'ra', 'll', 'rl'];

const LoadoutBuilderScreen = () => {
  const [state, setState] = useState<LoadoutState>({
    selectedMech: null,
    slots: { ...EMPTY_SLOTS },
  });

  const [mechPickerOpen, setMechPickerOpen] = useState(false);
  const [pickerLocation, setPickerLocation] = useState<LocationKey | null>(null);
  const [validation, setValidation] = useState<ValidationResult[]>([]);
  const [blockingDialog, setBlockingDialog] = useState<{
    isOpen: boolean;
    weaponName: string;
    locationKey: string;
    reason: 'OVERWEIGHT' | 'CRIT_OVERFLOW';
  } | null>(null);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    if (!state.selectedMech) { setValidation([]); return; }
    setValidation(validateLoadout(state.selectedMech, state));
  }, [state]);

  const handleSelectMech = useCallback((mech: Mech) => {
    const newSlots = { ...EMPTY_SLOTS } as Record<LocationKey, ReturnType<typeof parseHardpoints>>;
    for (const key of LOCATION_KEYS) {
      newSlots[key] = parseHardpoints(mech.hardpoints[key]);
    }
    setState({ selectedMech: mech, slots: newSlots });
  }, []);

  const handleWeaponAdd = useCallback((weapon: Weapon, slotIndex: number) => {
    if (!pickerLocation || !state.selectedMech) return;

    const check = wouldCreateNewError(weapon, pickerLocation, state.selectedMech, state, validation);
    if (check.blocked && check.reason) {
      setBlockingDialog({
        isOpen: true,
        weaponName: weapon.name,
        locationKey: pickerLocation,
        reason: check.reason,
      });
      return;
    }

    setState((prev) => {
      const locSlots = [...prev.slots[pickerLocation]];
      locSlots[slotIndex] = { ...locSlots[slotIndex], weapon };
      const newState = { ...prev, slots: { ...prev.slots, [pickerLocation]: locSlots } };

      // Auto-close picker if all slots in this location are now full
      const allFull = newState.slots[pickerLocation].every(s => !!s.weapon);
      if (allFull) {
        setTimeout(() => setPickerLocation(null), 0);
      }

      return newState;
    });
  }, [pickerLocation, state, validation]);

  const handleRemoveWeapon = useCallback((location: LocationKey, slotIndex: number) => {
    setState((prev) => {
      const locSlots = [...prev.slots[location]];
      locSlots[slotIndex] = { ...locSlots[slotIndex], weapon: null };
      return { ...prev, slots: { ...prev.slots, [location]: locSlots } };
    });
  }, []);

  const { selectedMech } = state;
  const hasOverweight = validation.some(v => v.code === 'OVERWEIGHT');

  return (
    <div className="space-y-4">
      <h1 className="font-mono uppercase tracking-wider text-primary font-bold" style={{ fontSize: 'var(--fs-heading)' }}>
        LOADOUT BUILDER
      </h1>

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
      {selectedMech && (
        <div className="grid grid-cols-2 gap-2">
          {LOCATION_KEYS.map((loc) => (
            <LocationCard
              key={loc}
              label={LOCATION_LABELS[loc]}
              hardpointStr={selectedMech.hardpoints[loc]}
              slots={state.slots[loc]}
              inventorySlots={selectedMech.inventorySlots[loc]}
              onOpenPicker={() => setPickerLocation(loc)}
              onRemoveWeapon={(slotIndex) => handleRemoveWeapon(loc, slotIndex)}
              hasCritOverflow={validation.some(v => v.code === 'CRIT_OVERFLOW' && v.locationKey === loc)}
            />
          ))}
        </div>
      )}

      {/* Mech Picker */}
      <MechPickerSheet
        open={mechPickerOpen}
        onClose={() => setMechPickerOpen(false)}
        onSelect={handleSelectMech}
      />

      {/* Unified Weapon Picker */}
      {pickerLocation && (
        <UnifiedWeaponPicker
          open={!!pickerLocation}
          locationKey={pickerLocation}
          slots={state.slots[pickerLocation]}
          onClose={() => setPickerLocation(null)}
          onAdd={handleWeaponAdd}
        />
      )}

      {/* Blocking Dialog */}
      {blockingDialog && (
        <BlockingDialog
          isOpen={blockingDialog.isOpen}
          weaponName={blockingDialog.weaponName}
          mechName={selectedMech?.name ?? ''}
          locationKey={blockingDialog.locationKey}
          reason={blockingDialog.reason}
          onClose={() => setBlockingDialog(null)}
        />
      )}
    </div>
  );
};

export default LoadoutBuilderScreen;
