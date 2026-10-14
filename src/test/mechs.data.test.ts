import { describe, it, expect } from 'vitest';
import { MECHS } from '@/data/mechs';

// Every DLC chassisdef in BTFM-DataRepository/DLC-Game-Data must be present.
const EXPECTED_DLC: Record<string, string[]> = {
  Flashpoint: ['CRB-27', 'CRB-27b', 'BSC-27', 'CP-10-HQ', 'CP-10-Q', 'CP-10-Z', 'HCT-3F', 'HCT-3X'],
  'Urban Warfare': ['CTF-0X', 'JVN-10A', 'JVN-10F', 'JVN-10N', 'RVN-1X', 'RVN-3X'],
  'Heavy Metal': [
    'ANH-1A', 'ANH-JH', 'ARC-2R', 'ARC-2S', 'ARC-LS', 'ARC-XO', 'ASN-101', 'ASN-21',
    'BSK-M3', 'BSK-MAZ', 'FLE-15', 'FLE-4', 'PXH-1', 'PXH-1K', 'PXH-1b',
    'RFL-3C', 'RFL-3N', 'RFL-4D', 'RFL-RIP', 'VL-2T', 'VL-5T',
    // Hero re-skins on base chassisdefs, tagged Heavy Metal by decision (STATUS D6)
    'MAD-BH', 'MAD-CM', 'AS7-GG',
  ],
};

const HARDPOINT_RE = /^(—|\d[BEMS]( \d[BEMS])*)$/;

describe('mechs data integrity', () => {
  it('has unique ids and unique variants', () => {
    const ids = MECHS.map(m => m.id);
    const variants = MECHS.map(m => m.variant);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(variants).size).toBe(variants.length);
  });

  it('keeps the original 72 base-game ids stable (saved loadouts reference them)', () => {
    for (let id = 1; id <= 72; id++) {
      expect(MECHS.some(m => m.id === id)).toBe(true);
    }
  });

  it('contains exactly the expected DLC mechs per DLC', () => {
    for (const [dlc, variants] of Object.entries(EXPECTED_DLC)) {
      const actual = MECHS.filter(m => m.dlcSource === dlc).map(m => m.variant).sort();
      expect(actual).toEqual([...variants].sort());
    }
  });

  it('has well-formed hardpoint strings', () => {
    for (const m of MECHS) {
      for (const v of Object.values(m.hardpoints)) {
        expect(v, `${m.variant}: ${v}`).toMatch(HARDPOINT_RE);
      }
    }
  });

  it('has sane tonnage values', () => {
    for (const m of MECHS) {
      expect(m.initialTonnage, m.variant).toBeGreaterThan(0);
      expect(m.initialTonnage, m.variant).toBeLessThan(m.tonnage);
      expect(m.maxArmor, m.variant).toBeGreaterThan(0);
    }
  });

  it('fixed equipment fits its location and leaves free tonnage', () => {
    for (const m of MECHS) {
      const fixed = m.fixedEquipment ?? [];
      const perLoc: Record<string, number> = {};
      let tons = 0;
      for (const f of fixed) {
        perLoc[f.location] = (perLoc[f.location] ?? 0) + f.slots;
        tons += f.tonnage;
      }
      for (const [loc, used] of Object.entries(perLoc)) {
        expect(used, `${m.variant} ${loc}`).toBeLessThanOrEqual(
          m.inventorySlots[loc as keyof typeof m.inventorySlots],
        );
      }
      expect(m.initialTonnage + tons, m.variant).toBeLessThan(m.tonnage);
    }
  });

  it('fixed jump jets never exceed the jump jet cap', () => {
    for (const m of MECHS) {
      const jj = (m.fixedEquipment ?? []).filter(f => f.isJumpJet).length;
      expect(jj, m.variant).toBeLessThanOrEqual(m.jumpJetsMax);
    }
  });

  it('gives 60 heat dissipation exactly to LosTech double-heat-sink mechs', () => {
    for (const m of MECHS) {
      expect(m.baseHeatDissipation, m.variant).toBe(m.isLosTech ? 60 : 30);
    }
  });
});
