export interface Equipment {
  id: number;
  name: string;
  category: 'Heat Sink' | 'Jump Jet' | 'Sensor' | 'Gyro' | 'Cockpit' | 'Actuator' | 'Other';
  tonnage: number;
  criticalSlots: number;
  effectDescription: string;
  isClan: boolean;
}

export const EQUIPMENT: Equipment[] = [

  // ── HEAT SINKS ─────────────────────────────────────────────────────────────

  {
    id: 1,
    name: 'Single Heat Sink',
    category: 'Heat Sink',
    tonnage: 1,
    criticalSlots: 1,
    effectDescription: 'Dissipates heat each turn. Every mech starts with 10 built into the engine at no slot or tonnage cost.',
    isClan: false,
  },
  {
    id: 2,
    name: 'Double Heat Sink',
    category: 'Heat Sink',
    tonnage: 1,
    criticalSlots: 3,
    effectDescription: 'LosTech. Dissipates significantly more heat per turn than Single Heat Sink at the same tonnage. Costs 3 critical slots.',
    isClan: false,
  },

  // ── JUMP JETS ──────────────────────────────────────────────────────────────

  {
    id: 3,
    name: 'Jump Jet (Light)',
    category: 'Jump Jet',
    tonnage: 0.5,
    criticalSlots: 1,
    effectDescription: 'Enables jump movement for Light mechs (under 55 tons). Each additional jet increases jump range. Install in legs or side torsos.',
    isClan: false,
  },
  {
    id: 4,
    name: 'Jump Jet (Medium)',
    category: 'Jump Jet',
    tonnage: 1,
    criticalSlots: 1,
    effectDescription: 'Enables jump movement for Medium mechs (55–75 tons). Each additional jet increases jump range.',
    isClan: false,
  },
  {
    id: 5,
    name: 'Jump Jet (Heavy)',
    category: 'Jump Jet',
    tonnage: 2,
    criticalSlots: 1,
    effectDescription: 'Enables jump movement for Heavy mechs (75–90 tons). Heavier per jet than Medium class.',
    isClan: false,
  },
  {
    id: 6,
    name: 'Jump Jet (Assault)',
    category: 'Jump Jet',
    tonnage: 4,
    criticalSlots: 1,
    effectDescription: 'Enables jump movement for Assault mechs (90+ tons). Very expensive in tonnage. Only a handful of Assault chassis support jump jets.',
    isClan: false,
  },

  // ── SENSORS / ELECTRONICS ──────────────────────────────────────────────────

  {
    id: 7,
    name: 'Guardian ECM Suite',
    category: 'Sensor',
    tonnage: 1.5,
    criticalSlots: 2,
    effectDescription: 'Disrupts enemy sensor locks. Reduces enemy accuracy against equipped mech and nearby allies. Counter to NARC and sensor-guided weapons.',
    isClan: false,
  },
  {
    id: 8,
    name: 'Beagle Active Probe',
    category: 'Sensor',
    tonnage: 1.5,
    criticalSlots: 2,
    effectDescription: 'Extends sensor range and reveals hidden enemy units before visual range is achieved. Useful for scout builds.',
    isClan: false,
  },
  {
    id: 9,
    name: 'Target Acquisition Gear (TAG)',
    category: 'Sensor',
    tonnage: 1,
    criticalSlots: 1,
    effectDescription: 'Marks targets for semi-guided munitions. Required to enable indirect LRM fire from allied mechs without direct line of sight to target.',
    isClan: false,
  },
  {
    id: 10,
    name: 'NARC Missile Beacon',
    category: 'Sensor',
    tonnage: 3,
    criticalSlots: 2,
    effectDescription: 'Fires a homing beacon that attaches to the target mech. Improves LRM accuracy against the tagged target. Requires ammo.',
    isClan: false,
  },

  // ── GYROS ──────────────────────────────────────────────────────────────────

  {
    id: 11,
    name: 'Gyro (Standard)',
    category: 'Gyro',
    tonnage: 1,
    criticalSlots: 1,
    effectDescription: 'Improves mech stability and resistance to knockdown from enemy stability damage. Installed in the centre torso gyro slot.',
    isClan: false,
  },

  // ── COCKPIT MODS ───────────────────────────────────────────────────────────

  {
    id: 12,
    name: 'Cockpit Mod (Standard)',
    category: 'Cockpit',
    tonnage: 1,
    criticalSlots: 1,
    effectDescription: 'Cockpit upgrades that improve pilot abilities such as sensor range, accuracy, or injury resistance. Various manufacturers and tiers available.',
    isClan: false,
  },

  // ── ACTUATORS ──────────────────────────────────────────────────────────────

  {
    id: 13,
    name: 'Actuator Enhancement',
    category: 'Actuator',
    tonnage: 1,
    criticalSlots: 1,
    effectDescription: 'Improves leg or arm actuators. Leg actuators improve sprint speed and terrain resistance. Arm actuators improve melee damage.',
    isClan: false,
  },

  // ── TARGETING SYSTEMS ──────────────────────────────────────────────────────

  {
    id: 14,
    name: 'Targeting / Tracking System',
    category: 'Other',
    tonnage: 1,
    criticalSlots: 1,
    effectDescription: 'Improves weapon accuracy, reduces to-hit penalty at range, or provides other fire-control bonuses. Various manufacturers and tiers available.',
    isClan: false,
  },

  // ── COMMAND MODULES ────────────────────────────────────────────────────────

  {
    id: 15,
    name: 'Lance Command Module',
    category: 'Other',
    tonnage: 3,
    criticalSlots: 3,
    effectDescription: 'Provides passive benefits to all lance members including improved initiative, accuracy or morale. Installed in the equipped mech only.',
    isClan: false,
  },
];
