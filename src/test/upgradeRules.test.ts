import { describe, it, expect } from 'vitest';
import { MECHS } from '@/data/mechs';
import { EQUIPMENT } from '@/data/equipment';
import { upgradeBlockReason, INSTALLABLE_UPGRADES } from '@/utils/upgradeRules';
import { matchesDlcMode, nextDlcMode } from '@/lib/dlcFilter';
import type { EquipmentSlot, LocationKey } from '@/types/loadout';

const mech = (v: string) => MECHS.find(m => m.variant === v)!;
const eq = (name: string) => EQUIPMENT.find(e => e.name === name)!;
const empty = (): Record<LocationKey, EquipmentSlot[]> =>
  ({ hd: [], ct: [], lt: [], rt: [], la: [], ra: [], ll: [], rl: [] });
const installed = (name: string): EquipmentSlot => {
  const data = eq(name);
  return { item: { kind: 'upgrade', data }, slotsUsed: data.criticalSlots };
};

describe('upgrade rules', () => {
  it('offers exactly the four installable DLC upgrades', () => {
    expect(INSTALLABLE_UPGRADES.map(u => u.name).sort())
      .toEqual(['Mortar', 'Prototype TSM', 'X-1 AP Equipment', 'X-1 ECM Equipment']);
  });

  it('allows ECM on a base mech', () => {
    expect(upgradeBlockReason(eq('X-1 ECM Equipment'), mech('GRF-4N'), 'rt', empty())).toBeNull();
  });

  it('blocks ECM and probe together', () => {
    const all = empty();
    all.lt = [installed('X-1 ECM Equipment')];
    expect(upgradeBlockReason(eq('X-1 AP Equipment'), mech('GRF-4N'), 'rt', all)).toMatch(/CONFLICTS/);
  });

  it('blocks ECM and probe on mechs with the fixed EW suite', () => {
    expect(upgradeBlockReason(eq('X-1 ECM Equipment'), mech('RVN-1X'), 'rt', empty())).toMatch(/CONFLICTS/);
    expect(upgradeBlockReason(eq('X-1 AP Equipment'), mech('CTF-0X'), 'rt', empty())).toMatch(/CONFLICTS/);
  });

  it('limits the mortar to side torsos and one artillery piece', () => {
    expect(upgradeBlockReason(eq('Mortar'), mech('GRF-4N'), 'la', empty())).toMatch(/LT \/ RT ONLY/);
    expect(upgradeBlockReason(eq('Mortar'), mech('GRF-4N'), 'lt', empty())).toBeNull();
    expect(upgradeBlockReason(eq('Mortar'), mech('BSK-MAZ'), 'lt', empty())).toMatch(/CONFLICTS/);
  });

  it('blocks a second TSM on the RVN-3X, which ships with one', () => {
    expect(upgradeBlockReason(eq('Prototype TSM'), mech('RVN-3X'), 'rt', empty())).toBe('ALREADY INSTALLED');
  });

  it('never offers built-in-only gear', () => {
    expect(upgradeBlockReason(eq('Hatchet'), mech('GRF-4N'), 'ra', empty())).toBe('BUILT-IN ONLY');
  });
});

describe('DLC filter modes', () => {
  it('cycles ALL -> ONLY -> HIDE -> ALL', () => {
    expect(nextDlcMode('ALL')).toBe('ONLY');
    expect(nextDlcMode('ONLY')).toBe('HIDE');
    expect(nextDlcMode('HIDE')).toBe('ALL');
  });

  it('filters in both directions', () => {
    expect(matchesDlcMode('Base', 'ALL')).toBe(true);
    expect(matchesDlcMode('Heavy Metal', 'ALL')).toBe(true);
    expect(matchesDlcMode('Base', 'ONLY')).toBe(false);
    expect(matchesDlcMode('Flashpoint', 'ONLY')).toBe(true);
    expect(matchesDlcMode('Base', 'HIDE')).toBe(true);
    expect(matchesDlcMode('Urban Warfare', 'HIDE')).toBe(false);
  });

  it('NO DLC leaves exactly the base-game mechs', () => {
    expect(MECHS.filter(m => matchesDlcMode(m.dlcSource, 'HIDE')).length).toBe(69);
  });
});
