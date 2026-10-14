import { describe, it, expect } from 'vitest';
import { WEAPONS } from '@/data/weapons';
import { weaponDisplayName } from '@/lib/weaponDisplayName';

describe('weapon display names', () => {
  it('are unique across all weapons', () => {
    const names = WEAPONS.map(weaponDisplayName);
    const dupes = names.filter((n, i) => names.indexOf(n) !== i);
    expect(dupes).toEqual([]);
  });

  it('leave unique names untouched', () => {
    expect(weaponDisplayName(WEAPONS.find(w => w.name === 'Medium Laser')!)).toBe('Medium Laser');
  });

  it('append the manufacturer to colliding tier variants', () => {
    const snub = WEAPONS.filter(w => w.name === 'Snub PPC +').map(weaponDisplayName).sort();
    expect(snub).toEqual(['Snub PPC + (Ceres Arms)', 'Snub PPC + (Donal)', 'Snub PPC + (Magna)']);
  });
});
