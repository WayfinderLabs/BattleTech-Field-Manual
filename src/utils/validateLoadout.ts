import type { Mech } from '@/data/mechs';
import type { Weapon } from '@/data/weapons';
import type { LoadoutState, LocationKey } from '@/types/loadout';

export type ValidationSeverity = 'ERROR' | 'WARNING';

export interface ValidationResult {
  severity: ValidationSeverity;
  code: 'OVERWEIGHT' | 'CRIT_OVERFLOW' | 'AMMO_DEPENDENCY';
  message: string;
  locationKey?: LocationKey;
}

export function validateLoadout(
  mech: Mech,
  state: LoadoutState
): ValidationResult[] {
  const results: ValidationResult[] = [];
  const locationKeys = Object.keys(state.slots) as LocationKey[];

  // Collect all equipped weapons
  const allWeapons: Weapon[] = [];
  for (const key of locationKeys) {
    for (const slot of state.slots[key]) {
      if (slot.weapon) allWeapons.push(slot.weapon);
    }
  }

  // 1. OVERWEIGHT
  const tonnageUsed = allWeapons.reduce((sum, w) => sum + w.tonnage, 0);
  if (tonnageUsed > mech.tonnage) {
    results.push({
      severity: 'ERROR',
      code: 'OVERWEIGHT',
      message: `Loadout exceeds weight limit (${tonnageUsed}t used / ${mech.tonnage}t max)`,
    });
  }

  // 2. CRIT SLOT OVERFLOW — checked per location
  for (const key of locationKeys) {
    const weapons = state.slots[key].filter(s => s.weapon).map(s => s.weapon!);
    const slotsUsed = weapons.reduce((sum, w) => sum + w.criticalSlots, 0);
    const slotsAvailable = mech.inventorySlots[key];
    if (slotsUsed > slotsAvailable) {
      results.push({
        severity: 'ERROR',
        code: 'CRIT_OVERFLOW',
        message: `${key.toUpperCase()}: ${slotsUsed} slots used, only ${slotsAvailable} available`,
        locationKey: key,
      });
    }
  }

  // 3. AMMO DEPENDENCY — warn once if any Ballistic or Missile weapon present
  const hasAmmoWeapon = allWeapons.some(
    w => w.category === 'Ballistic' || w.category === 'Missile'
  );
  if (hasAmmoWeapon) {
    results.push({
      severity: 'WARNING',
      code: 'AMMO_DEPENDENCY',
      message: 'Ballistic or Missile weapons equipped — ammo bins not yet tracked',
    });
  }

  return results;
}

// Helper: would adding this weapon to this location create a NEW error?
export function wouldCreateNewError(
  weapon: Weapon,
  locationKey: LocationKey,
  mech: Mech,
  state: LoadoutState,
  currentValidation: ValidationResult[]
): { blocked: boolean; reason: 'OVERWEIGHT' | 'CRIT_OVERFLOW' | null } {
  const alreadyOverweight = currentValidation.some(v => v.code === 'OVERWEIGHT');
  const alreadyOverflow = currentValidation.some(
    v => v.code === 'CRIT_OVERFLOW' && v.locationKey === locationKey
  );

  // Check overweight
  if (!alreadyOverweight) {
    let currentTonnage = 0;
    for (const slots of Object.values(state.slots)) {
      for (const s of slots) {
        if (s.weapon) currentTonnage += s.weapon.tonnage;
      }
    }
    if (currentTonnage + weapon.tonnage > mech.tonnage) {
      return { blocked: true, reason: 'OVERWEIGHT' };
    }
  }

  // Check crit overflow
  if (!alreadyOverflow) {
    const currentSlots = state.slots[locationKey]
      .filter(s => s.weapon)
      .reduce((sum, s) => sum + s.weapon!.criticalSlots, 0);
    if (currentSlots + weapon.criticalSlots > mech.inventorySlots[locationKey]) {
      return { blocked: true, reason: 'CRIT_OVERFLOW' };
    }
  }

  return { blocked: false, reason: null };
}
