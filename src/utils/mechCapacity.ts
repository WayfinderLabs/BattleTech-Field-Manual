import type { Mech, MechLocationKey } from '@/data/mechs';

/**
 * Single source of truth for how much room a mech has for player-installed
 * gear. Fixed (built-in) equipment is reserved here so every screen agrees.
 */

export function fixedTonnage(mech: Mech): number {
  return (mech.fixedEquipment ?? []).reduce((sum, f) => sum + f.tonnage, 0);
}

export function fixedSlots(mech: Mech, loc: MechLocationKey): number {
  return (mech.fixedEquipment ?? [])
    .filter(f => f.location === loc)
    .reduce((sum, f) => sum + f.slots, 0);
}

export function fixedItemsAt(mech: Mech, loc: MechLocationKey) {
  return (mech.fixedEquipment ?? []).filter(f => f.location === loc);
}

export function fixedJumpJets(mech: Mech): number {
  return (mech.fixedEquipment ?? []).filter(f => f.isJumpJet).length;
}

/** Armor weight: 80 points per ton, as the builder already uses. */
export const ARMOR_TONS_PER_POINT = 0.0125;

/** Round to 1/10000 t so float noise never flips an overweight check. */
export const roundTons = (t: number) => Math.round(t * 10000) / 10000;

/** Tonnage available for weapons and equipment the player installs. */
export function availableTonnage(mech: Mech): number {
  return mech.tonnage - mech.initialTonnage - fixedTonnage(mech);
}

/** Inventory slots in a location left after fixed equipment. */
export function availableSlots(mech: Mech, loc: MechLocationKey): number {
  return mech.inventorySlots[loc] - fixedSlots(mech, loc);
}

/** Jump jets the player can still install after fixed jump jets. */
export function availableJumpJets(mech: Mech): number {
  return Math.max(0, mech.jumpJetsMax - fixedJumpJets(mech));
}
