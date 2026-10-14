import { EQUIPMENT, type Equipment } from '@/data/equipment';
import type { Mech } from '@/data/mechs';
import type { EquipmentSlot, LocationKey } from '@/types/loadout';

/** Equipment ids on the mech: fixed gear plus upgrades the player installed. */
export function equipmentIdsOnMech(
  mech: Mech,
  allEquipment: Record<LocationKey, EquipmentSlot[]>,
): number[] {
  const ids: number[] = [];
  for (const f of mech.fixedEquipment ?? []) {
    const ref = EQUIPMENT.find(e => e.gameId === f.id);
    if (ref) ids.push(ref.id);
  }
  for (const loc of Object.keys(allEquipment) as LocationKey[]) {
    for (const eq of allEquipment[loc]) {
      if (eq.item?.kind === 'upgrade') ids.push(eq.item.data.id);
    }
  }
  return ids;
}

/** Why an upgrade cannot go in this location, or null if it can. */
export function upgradeBlockReason(
  eq: Equipment,
  mech: Mech,
  locationKey: LocationKey,
  allEquipment: Record<LocationKey, EquipmentSlot[]>,
): string | null {
  if (!eq.installable) return 'BUILT-IN ONLY';
  if (eq.allowedLocations && !eq.allowedLocations.includes(locationKey)) {
    return `${eq.allowedLocations.map(l => l.toUpperCase()).join(' / ')} ONLY`;
  }
  const onMech = equipmentIdsOnMech(mech, allEquipment);
  if (eq.maxPerMech !== undefined && onMech.filter(id => id === eq.id).length >= eq.maxPerMech) {
    return eq.maxPerMech === 1 ? 'ALREADY INSTALLED' : `MAX ${eq.maxPerMech} PER MECH`;
  }
  const clash = (eq.exclusiveWith ?? []).find(id => onMech.includes(id));
  if (clash !== undefined) {
    const other = EQUIPMENT.find(e => e.id === clash);
    return `CONFLICTS WITH ${other ? other.name.toUpperCase() : 'INSTALLED GEAR'}`;
  }
  return null;
}

export const INSTALLABLE_UPGRADES: Equipment[] = EQUIPMENT.filter(e => e.installable);
