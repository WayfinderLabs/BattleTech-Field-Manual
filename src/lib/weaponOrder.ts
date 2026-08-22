export const WEAPON_ORDER: Record<string, number> = {
  // ── BALLISTIC ──────────────────────────────────────
  'Ballistic:AC/2':          100,
  'Ballistic:AC/5':          110,
  'Ballistic:AC/10':         120,
  'Ballistic:AC/20':         130,
  'Ballistic:Gauss Rifle':   140,
  // Heavy Metal DLC
  'Ballistic:UAC/2':   150,
  'Ballistic:UAC/5':   151,
  'Ballistic:UAC/10':  152,
  'Ballistic:UAC/20':  153,
  'Ballistic:LB 2-X':   160,
  'Ballistic:LB 5-X':   161,
  'Ballistic:LB 10-X':  162,
  'Ballistic:LB 20-X':  163,
  // ── ENERGY ─────────────────────────────────────────
  'Energy:Small Laser':         200,
  'Energy:Medium Laser':        210,
  'Energy:Large Laser':         220,
  'Energy:ER Small Laser':      230,
  'Energy:ER Medium Laser':     240,
  'Energy:ER Large Laser':      250,
  'Energy:Small Pulse Laser':   260,
  'Energy:Medium Pulse Laser':  270,
  'Energy:Large Pulse Laser':   280,
  'Energy:PPC':                 290,
  'Energy:ER PPC':              300,
  'Energy:Flamer':              310,
  // Heavy Metal DLC
  'Energy:Snub PPC':  320,
  'Energy:TAG':       321,
  // ── MISSILE ────────────────────────────────────────
  'Missile:SRM 2':    400,
  'Missile:SRM 4':    410,
  'Missile:SRM 6':    420,
  'Missile:LRM 5':    430,
  'Missile:LRM 10':   440,
  'Missile:LRM 15':   450,
  'Missile:LRM 20':   460,
  // Heavy Metal DLC
  'Missile:Narc Beacon': 470,
  'Missile:Infernos':    471,

  // ── SUPPORT ────────────────────────────────────────
  'Support:Small Laser':       500,
  'Support:ER Small Laser':    510,
  'Support:Small Pulse Laser': 520,
  'Support:Machine Gun':       530,
  'Support:Flamer':            540,
};

export const isTierVariant = (name: string) => name.includes('+');

export const stripTier = (name: string) =>
  name.replace(/\s*(\+\s*)+$/, '').trim();

export const getTier = (name: string) => {
  const match = name.match(/(\+[\s+]*)+$/);
  if (!match) return 0;
  return (match[0].match(/\+/g) || []).length;
};
