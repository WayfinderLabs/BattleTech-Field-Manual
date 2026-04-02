import type { Mech } from '@/data/mechs';
import type { Weapon } from '@/data/weapons';
import type { LoadoutState, LocationKey, SlotItem, EquipmentSlot } from '@/types/loadout';

export type ValidationSeverity = 'ERROR' | 'WARNING';

export interface ValidationResult {
  severity: ValidationSeverity;
  code: 'OVERWEIGHT' | 'CRIT_OVERFLOW' | 'JUMP_JET_EXCEEDED';
  message: string;
  locationKey?: LocationKey;
}

/** Get tonnage of any slot item */
function itemTonnage(item: SlotItem): number {
  return item.data.tonnage;
}

/** Get critical slots of any slot item */
function itemSlots(item: SlotItem): number {
  if (item.kind === 'weapon') return item.data.criticalSlots;
  return item.data.slots;
}

/** Collect all weapons from loadout state */
function collectWeapons(state: LoadoutState): Weapon[] {
  const weapons: Weapon[] = [];
  const locationKeys = Object.keys(state.slots) as LocationKey[];
  for (const key of locationKeys) {
    for (const slot of state.slots[key]) {
      if (slot.weapon) weapons.push(slot.weapon);
    }
  }
  return weapons;
}

/** Collect all equipment items from loadout state */
function collectEquipment(state: LoadoutState): SlotItem[] {
  const items: SlotItem[] = [];
  const locationKeys = Object.keys(state.equipment) as LocationKey[];
  for (const key of locationKeys) {
    for (const eq of state.equipment[key]) {
      if (eq.item) items.push(eq.item);
    }
  }
  return items;
}

/** Count total jump jets across all locations */
function countJumpJets(state: LoadoutState): number {
  let count = 0;
  const locationKeys = Object.keys(state.equipment) as LocationKey[];
  for (const key of locationKeys) {
    for (const eq of state.equipment[key]) {
      if (eq.item?.kind === 'jumpJet') count++;
    }
  }
  return count;
}


export function validateLoadout(
  mech: Mech,
  state: LoadoutState
): ValidationResult[] {
  const results: ValidationResult[] = [];
  const locationKeys = Object.keys(state.slots) as LocationKey[];
  const allWeapons = collectWeapons(state);
  const allEquipment = collectEquipment(state);

  // 1. OVERWEIGHT — sum weapons + equipment tonnage
  const weaponTonnage = allWeapons.reduce((sum, w) => sum + w.tonnage, 0);
  const equipTonnage = allEquipment.reduce((sum, item) => sum + itemTonnage(item), 0);
  const tonnageUsed = weaponTonnage + equipTonnage;
  if (tonnageUsed > mech.tonnage) {
    results.push({
      severity: 'ERROR',
      code: 'OVERWEIGHT',
      message: `Loadout exceeds weight limit (${tonnageUsed}t used / ${mech.tonnage}t max)`,
    });
  }

  // 2. CRIT SLOT OVERFLOW — per location (weapons + equipment)
  for (const key of locationKeys) {
    const weaponSlots = state.slots[key]
      .filter(s => s.weapon)
      .reduce((sum, s) => sum + s.weapon!.criticalSlots, 0);
    const equipSlots = state.equipment[key]
      .reduce((sum, eq) => sum + eq.slotsUsed, 0);
    const slotsUsed = weaponSlots + equipSlots;
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

  // 3. JUMP JET CAP EXCEEDED
  const jjCount = countJumpJets(state);
  if (jjCount > mech.jumpJetsMax) {
    results.push({
      severity: 'WARNING',
      code: 'JUMP_JET_EXCEEDED',
      message: `Jump jet limit exceeded — ${jjCount} installed, max ${mech.jumpJetsMax}`,
    });
  }

  return results;
}

// Helper: would adding this item to this location create a NEW error?
export function wouldCreateNewError(
  item: SlotItem,
  locationKey: LocationKey,
  mech: Mech,
  state: LoadoutState,
  currentValidation: ValidationResult[]
): { blocked: boolean; reason: 'OVERWEIGHT' | 'CRIT_OVERFLOW' | null } {
  const alreadyOverweight = currentValidation.some(v => v.code === 'OVERWEIGHT');
  const alreadyOverflow = currentValidation.some(
    v => v.code === 'CRIT_OVERFLOW' && v.locationKey === locationKey
  );

  const addTonnage = itemTonnage(item);
  const addSlots = itemSlots(item);

  // Check overweight
  if (!alreadyOverweight) {
    let currentTonnage = 0;
    for (const slots of Object.values(state.slots)) {
      for (const s of slots) {
        if (s.weapon) currentTonnage += s.weapon.tonnage;
      }
    }
    for (const eqs of Object.values(state.equipment)) {
      for (const eq of eqs) {
        if (eq.item) currentTonnage += itemTonnage(eq.item);
      }
    }
    if (currentTonnage + addTonnage > mech.tonnage) {
      return { blocked: true, reason: 'OVERWEIGHT' };
    }
  }

  // Check crit overflow
  if (!alreadyOverflow) {
    const weaponSlots = state.slots[locationKey]
      .filter(s => s.weapon)
      .reduce((sum, s) => sum + s.weapon!.criticalSlots, 0);
    const equipSlots = state.equipment[locationKey]
      .reduce((sum, eq) => sum + eq.slotsUsed, 0);
    const currentSlots = weaponSlots + equipSlots;
    if (currentSlots + addSlots > mech.inventorySlots[locationKey]) {
      return { blocked: true, reason: 'CRIT_OVERFLOW' };
    }
  }

  return { blocked: false, reason: null };
}
