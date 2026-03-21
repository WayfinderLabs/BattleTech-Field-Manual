export interface Equipment {
  id: number;
  name: string;
  category: 'Heat Sink' | 'Jump Jet' | 'Sensor' | 'Actuator' | 'Structure' | 'Armor' | 'Other';
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
    effectDescription: 'Dissipates 3 heat per turn. Standard heat management. Every mech starts with 10 built into the engine at no extra cost.',
    isClan: false,
  },
  {
    id: 2,
    name: 'Double Heat Sink',
    category: 'Heat Sink',
    tonnage: 1,
    criticalSlots: 3,
    effectDescription: 'Dissipates 6 heat per turn — double efficiency of Single Heat Sink. Costs 3 critical slots. LosTech. Major upgrade for energy-heavy builds.',
    isClan: false,
  },
  {
    id: 3,
    name: 'Clan Double Heat Sink',
    category: 'Heat Sink',
    tonnage: 1,
    criticalSlots: 2,
    effectDescription: 'Clan-spec Double Heat Sink. Dissipates 6 heat per turn using only 2 critical slots vs 3 for IS version. Significant slot advantage.',
    isClan: true,
  },

  // ── JUMP JETS ──────────────────────────────────────────────────────────────

  {
    id: 4,
    name: 'Jump Jet (Light)',
    category: 'Jump Jet',
    tonnage: 0.5,
    criticalSlots: 1,
    effectDescription: 'Enables jump movement for Light mechs (under 55 tons). Each jet adds one hex of jump range. Install in legs or side torsos.',
    isClan: false,
  },
  {
    id: 5,
    name: 'Jump Jet (Medium)',
    category: 'Jump Jet',
    tonnage: 1,
    criticalSlots: 1,
    effectDescription: 'Enables jump movement for Medium mechs (55–75 tons). Each jet adds one hex of jump range.',
    isClan: false,
  },
  {
    id: 6,
    name: 'Jump Jet (Heavy)',
    category: 'Jump Jet',
    tonnage: 2,
    criticalSlots: 1,
    effectDescription: 'Enables jump movement for Heavy mechs (75–90 tons). Heavier per jet than Medium class.',
    isClan: false,
  },
  {
    id: 7,
    name: 'Jump Jet (Assault)',
    category: 'Jump Jet',
    tonnage: 4,
    criticalSlots: 1,
    effectDescription: 'Enables jump movement for Assault mechs (90+ tons). Very expensive in tonnage. Only a handful of Assault chassis support them.',
    isClan: false,
  },

  // ── SENSORS / ELECTRONICS ──────────────────────────────────────────────────

  {
    id: 8,
    name: 'Guardian ECM Suite',
    category: 'Sensor',
    tonnage: 1.5,
    criticalSlots: 2,
    effectDescription: 'Disrupts enemy sensor locks and targeting systems. Reduces enemy accuracy against the equipped mech and nearby allies. Counter to NARC and sensor-guided weapons.',
    isClan: false,
  },
  {
    id: 9,
    name: 'Beagle Active Probe',
    category: 'Sensor',
    tonnage: 1.5,
    criticalSlots: 2,
    effectDescription: 'Extends sensor range and reveals hidden units. Allows detection of enemy mechs before visual range. Useful for scout builds.',
    isClan: false,
  },
  {
    id: 10,
    name: 'Clan Active Probe',
    category: 'Sensor',
    tonnage: 1,
    criticalSlots: 1,
    effectDescription: 'Clan-spec Active Probe. Same detection capability as Beagle Active Probe but lighter and fewer slots.',
    isClan: true,
  },
  {
    id: 11,
    name: 'Target Acquisition Gear (TAG)',
    category: 'Sensor',
    tonnage: 1,
    criticalSlots: 1,
    effectDescription: 'Marks targets for semi-guided munitions. Required to enable indirect LRM fire from allied mechs without direct line of sight.',
    isClan: false,
  },

  // ── MOBILITY UPGRADES ──────────────────────────────────────────────────────

  {
    id: 12,
    name: 'MASC',
    category: 'Other',
    tonnage: 2,
    criticalSlots: 2,
    effectDescription: 'Myomer Accelerator Signal Circuitry. Allows mech to sprint at significantly increased speed for a limited duration. Risk of leg actuator damage on extended use.',
    isClan: false,
  },
  {
    id: 13,
    name: 'Clan MASC',
    category: 'Other',
    tonnage: 1,
    criticalSlots: 1,
    effectDescription: 'Clan-spec MASC. Same sprint boost as IS version but lighter and more compact. More reliable than IS variant.',
    isClan: true,
  },

  // ── STRUCTURE & ARMOR ──────────────────────────────────────────────────────

  {
    id: 14,
    name: 'Endo-Steel Structure',
    category: 'Structure',
    tonnage: 0,
    criticalSlots: 14,
    effectDescription: 'Reduces internal structure weight by 50%, freeing tonnage for weapons and equipment. Costs 14 critical slots distributed across the mech.',
    isClan: false,
  },
  {
    id: 15,
    name: 'Ferro-Fibrous Armor',
    category: 'Armor',
    tonnage: 0,
    criticalSlots: 14,
    effectDescription: 'Increases armor protection by approximately 12% for the same tonnage as standard armor. Costs 14 critical slots. Best on mechs with spare slot capacity.',
    isClan: false,
  },
  {
    id: 16,
    name: 'Clan Endo-Steel',
    category: 'Structure',
    tonnage: 0,
    criticalSlots: 7,
    effectDescription: 'Clan-spec Endo-Steel. Same 50% structure weight reduction using only 7 critical slots vs 14 for IS version. Major slot advantage.',
    isClan: true,
  },
  {
    id: 17,
    name: 'Clan Ferro-Fibrous',
    category: 'Armor',
    tonnage: 0,
    criticalSlots: 7,
    effectDescription: 'Clan-spec Ferro-Fibrous. Same 12% armor bonus using only 7 critical slots vs 14 for IS version.',
    isClan: true,
  },

  // ── GYRO UPGRADES ──────────────────────────────────────────────────────────

  {
    id: 18,
    name: 'Gyro Upgrade',
    category: 'Other',
    tonnage: 1,
    criticalSlots: 1,
    effectDescription: 'Improves mech stability and resistance to knockdown. Reduces effectiveness of enemy stability damage. Installed in centre torso gyro slot.',
    isClan: false,
  },

  // ── LEG UPGRADES ───────────────────────────────────────────────────────────

  {
    id: 19,
    name: 'Leg Upgrade',
    category: 'Actuator',
    tonnage: 1,
    criticalSlots: 1,
    effectDescription: 'Improves sprint speed and reduces chance of leg damage from difficult terrain. Installed in leg actuator slots.',
    isClan: false,
  },
];
