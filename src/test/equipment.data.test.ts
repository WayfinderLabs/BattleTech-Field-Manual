import { describe, it, expect } from 'vitest';
import { EQUIPMENT } from '@/data/equipment';
import { MECHS } from '@/data/mechs';
import { WEAPONS } from '@/data/weapons';

describe('equipment data integrity', () => {
  it('has unique ids', () => {
    const ids = EQUIPMENT.map(e => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every fixed item on a mech has a matching built-in reference entry', () => {
    for (const m of MECHS) {
      for (const f of m.fixedEquipment ?? []) {
        const ref = EQUIPMENT.find(e => e.gameId === f.id);
        expect(ref, `${m.variant}: ${f.id}`).toBeDefined();
        expect(ref!.builtInOn, f.id).toContain(m.variant);
        expect(ref!.tonnage, f.id).toBe(f.tonnage);
        expect(ref!.criticalSlots, f.id).toBe(f.slots);
      }
    }
  });

  it('every builtInOn variant really carries that item', () => {
    for (const e of EQUIPMENT.filter(x => x.builtInOn)) {
      for (const v of e.builtInOn!) {
        const m = MECHS.find(x => x.variant === v);
        expect(m, `${e.name} -> ${v}`).toBeDefined();
        expect(m!.fixedEquipment?.some(f => f.id === e.gameId), `${e.name} on ${v}`).toBe(true);
      }
    }
  });

  it('only the Prototype TSM is both buyable and fixed', () => {
    const both = EQUIPMENT.filter(e => e.builtInOn && e.installable).map(e => e.name);
    expect(both).toEqual(['Prototype TSM']);
  });

  it('replaced the wrong Urban Warfare items with the X-1 prototypes', () => {
    const names = EQUIPMENT.map(e => e.name);
    expect(names).not.toContain('Guardian ECM Suite');
    expect(names).not.toContain('Beagle Active Probe');
    expect(names).toEqual(expect.arrayContaining(['X-1 ECM Equipment', 'X-1 AP Equipment', 'X-1 EW Equipment', 'Prototype TSM']));
  });
});

describe('weapons data integrity', () => {
  it('has unique ids', () => {
    const ids = WEAPONS.map(w => w.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('includes every Heavy Metal weapon family from the DLC source', () => {
    const hm = WEAPONS.filter(w => w.dlcSource === 'Heavy Metal');
    // 45 source defs minus 2 unfinished mortar weapon records (mortars ship as equipment)
    expect(hm.length).toBe(43);
    for (const n of ['COIL-S', 'COIL-M', 'COIL-L']) {
      expect(hm.some(w => w.name === n), n).toBe(true);
    }
  });
});
