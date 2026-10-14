import { describe, it, expect } from 'vitest';
import { MECHS } from '@/data/mechs';
import { WEAPONS } from '@/data/weapons';
import { JUMP_JETS } from '@/data/loadoutEquipment';
import { validateLoadout, wouldCreateNewError } from '@/utils/validateLoadout';
import { availableTonnage, availableSlots, availableJumpJets } from '@/utils/mechCapacity';
import type { LoadoutState, LocationKey, EquipmentSlot } from '@/types/loadout';

const mech = (variant: string) => MECHS.find(m => m.variant === variant)!;

const emptyState = (variant: string): LoadoutState => ({
  selectedMech: mech(variant),
  slots: { hd: [], ct: [], lt: [], rt: [], la: [], ra: [], ll: [], rl: [] },
  equipment: { hd: [], ct: [], lt: [], rt: [], la: [], ra: [], ll: [], rl: [] },
});

describe('fixed equipment capacity', () => {
  it('reserves Thumper tonnage and RT slots on BSK-MAZ', () => {
    const m = mech('BSK-MAZ');
    expect(availableTonnage(m)).toBe(95 - 19.5 - 10);
    expect(availableSlots(m, 'rt')).toBe(10 - 8);
    expect(availableSlots(m, 'lt')).toBe(10);
  });

  it('leaves base-game mechs unchanged', () => {
    const m = mech('GRF-4N');
    expect(availableTonnage(m)).toBe(m.tonnage - m.initialTonnage);
    expect(availableSlots(m, 'rt')).toBe(m.inventorySlots.rt);
  });

  it('counts Vectored Thrust Kits against the jump jet cap', () => {
    expect(availableJumpJets(mech('PXH-1'))).toBe(6 - 2);
  });

  it('flags crit overflow when RT gear would collide with the fixed Thumper', () => {
    const state = emptyState('BSK-MAZ');
    const ac20 = WEAPONS.find(w => w.name === 'AC/20')!;
    expect(ac20.criticalSlots).toBeGreaterThan(2);
    const block = wouldCreateNewError({ kind: 'weapon', data: ac20 }, 'rt' as LocationKey, state.selectedMech!, state, []);
    expect(block).toEqual({ blocked: true, reason: 'CRIT_OVERFLOW' });
  });

  it('flags jump jet excess counting fixed jump jets', () => {
    const state = emptyState('PXH-1');
    const jj = JUMP_JETS.find(j => 45 >= j.minTonnage && 45 <= j.maxTonnage)!;
    const slot = (): EquipmentSlot => ({ item: { kind: 'jumpJet', data: jj }, slotsUsed: jj.slots });
    state.equipment.ct = [slot(), slot(), slot(), slot()];
    expect(validateLoadout(state.selectedMech!, state).some(v => v.code === 'JUMP_JET_EXCEEDED')).toBe(false);
    state.equipment.ll = [slot()];
    expect(validateLoadout(state.selectedMech!, state).some(v => v.code === 'JUMP_JET_EXCEEDED')).toBe(true);
  });

  it('an empty DLC mech with fixed gear is valid', () => {
    for (const m of MECHS.filter(x => x.fixedEquipment?.length)) {
      const state = emptyState(m.variant);
      expect(validateLoadout(m, state), m.variant).toEqual([]);
    }
  });

  it('counts armor weight toward the tonnage limit', () => {
    const state = emptyState('GRF-4N');
    const m = state.selectedMech!;
    const free = availableTonnage(m);
    const fullArmorPoints = free / 0.0125;
    expect(validateLoadout(m, state, fullArmorPoints)).toEqual([]);
    const ml = WEAPONS.find(w => w.name === 'Medium Laser')!;
    const block = wouldCreateNewError({ kind: 'weapon', data: ml }, 'ra', m, state, [], fullArmorPoints);
    expect(block).toEqual({ blocked: true, reason: 'OVERWEIGHT' });
    expect(validateLoadout(m, state, fullArmorPoints + 80).some(v => v.code === 'OVERWEIGHT')).toBe(true);
  });
});
