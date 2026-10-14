import { WEAPONS, type Weapon } from '@/data/weapons';

const nameCounts = WEAPONS.reduce<Record<string, number>>((acc, w) => {
  acc[w.name] = (acc[w.name] ?? 0) + 1;
  return acc;
}, {});

export function manufacturerOf(w: Pick<Weapon, 'notes'>): string | null {
  const m = w.notes?.match(/Manufacturer:\s*([^.]+)\./);
  return m ? m[1].trim() : null;
}

/**
 * Name shown to the player. Tier variants that share a name (e.g. five
 * "AC/10 +") get their manufacturer appended so they can be told apart in
 * lists, equipped slots and share text. Unique names are unchanged.
 */
export function weaponDisplayName(w: Pick<Weapon, 'name' | 'notes'>): string {
  if ((nameCounts[w.name] ?? 0) < 2) return w.name;
  const mfr = manufacturerOf(w);
  return mfr ? `${w.name} (${mfr})` : w.name;
}
