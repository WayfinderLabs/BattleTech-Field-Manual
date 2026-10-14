import type { MechLocationKey } from '@/data/mechs';

export interface Equipment {
  id: number;
  name: string;
  category: 'Heat Sink' | 'Jump Jet' | 'Sensor' | 'Gyro' | 'Cockpit' | 'Actuator' | 'Upgrade' | 'Other';
  tonnage: number;
  criticalSlots: number;
  effectDescription: string;
  isClan: boolean;
  dlcSource: 'Base' | 'Flashpoint' | 'Urban Warfare' | 'Heavy Metal';
  /** Game ComponentDefID, for items sourced from a specific game JSON */
  gameId?: string;
  /** Player can install this in the loadout builder */
  installable?: boolean;
  /** Ships as fixed (non-removable) equipment on these variants. If not also installable, it exists only as fixed gear. */
  builtInOn?: string[];
  /** Restrict where it can be mounted (default: anywhere) */
  allowedLocations?: MechLocationKey[];
  /** Cannot be mounted on the same mech as these equipment ids */
  exclusiveWith?: number[];
  /** Maximum copies per mech */
  maxPerMech?: number;
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
    dlcSource: 'Base',
  },
  {
    id: 2,
    name: 'Double Heat Sink',
    category: 'Heat Sink',
    tonnage: 1,
    criticalSlots: 3,
    effectDescription: 'LosTech. Dissipates significantly more heat per turn than Single Heat Sink at the same tonnage. Costs 3 critical slots.',
    isClan: false,
    dlcSource: 'Base',
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
    dlcSource: 'Base',
  },
  {
    id: 4,
    name: 'Jump Jet (Medium)',
    category: 'Jump Jet',
    tonnage: 1,
    criticalSlots: 1,
    effectDescription: 'Enables jump movement for Medium mechs (55–75 tons). Each additional jet increases jump range.',
    isClan: false,
    dlcSource: 'Base',
  },
  {
    id: 5,
    name: 'Jump Jet (Heavy)',
    category: 'Jump Jet',
    tonnage: 2,
    criticalSlots: 1,
    effectDescription: 'Enables jump movement for Heavy mechs (75–90 tons). Heavier per jet than Medium class.',
    isClan: false,
    dlcSource: 'Base',
  },
  {
    id: 6,
    name: 'Jump Jet (Assault)',
    category: 'Jump Jet',
    tonnage: 4,
    criticalSlots: 1,
    effectDescription: 'Enables jump movement for Assault mechs (90+ tons). Very expensive in tonnage. Only a handful of Assault chassis support jump jets.',
    isClan: false,
    dlcSource: 'Base',
  },

  // ── SENSORS / ELECTRONICS ──────────────────────────────────────────────────

  {
    id: 7,
    name: 'X-1 ECM Equipment',
    category: 'Sensor',
    tonnage: 6,
    criticalSlots: 4,
    effectDescription: 'Prototype Guardian ECM. Allies in the ECM field gain missile defense (+4 vs missiles), immunity to indirect fire and stealth charges; they cannot be targeted unless spotted. Cannot be mounted with X-1 AP Equipment.',
    isClan: false,
    dlcSource: 'Urban Warfare',
    gameId: 'Gear_Sensor_Prototype_ECM',
    installable: true,
    exclusiveWith: [8],
    maxPerMech: 1,
  },
  {
    id: 8,
    name: 'X-1 AP Equipment',
    category: 'Sensor',
    tonnage: 6,
    criticalSlots: 4,
    effectDescription: 'Prototype Beagle Active Probe. When activated, performs a Sensor Lock on every enemy in its radius, then goes on cooldown. Cannot be mounted with X-1 ECM Equipment.',
    isClan: false,
    dlcSource: 'Urban Warfare',
    gameId: 'Gear_Sensor_Prototype_ActiveProbe',
    installable: true,
    exclusiveWith: [7],
    maxPerMech: 1,
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
    dlcSource: 'Base',
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
    dlcSource: 'Base',
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
    dlcSource: 'Base',
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
    dlcSource: 'Base',
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
    dlcSource: 'Base',
  },

  // ── DLC UPGRADES (installable) ─────────────────────────────────────────────

  {
    id: 16,
    name: 'Prototype TSM',
    category: 'Upgrade',
    tonnage: 0,
    criticalSlots: 4,
    effectDescription: 'Experimental Triple Strength Myomer. Walk and run speed x1.5. Unstable: can explode if the location takes weapons fire.',
    isClan: false,
    dlcSource: 'Urban Warfare',
    gameId: 'Gear_Structure_Prototype_TSM',
    installable: true,
    builtInOn: ['RVN-3X'],
    maxPerMech: 1,
  },
  {
    id: 17,
    name: 'Mortar',
    category: 'Upgrade',
    tonnage: 7,
    criticalSlots: 4,
    effectDescription: 'Single-use artillery. Deals area damage to every unit in the target zone. Side torso only. Only one artillery piece per mech. Damage stats are not available in the source data.',
    isClan: false,
    dlcSource: 'Heavy Metal',
    gameId: 'Gear_Mortar_MechMortar',
    installable: true,
    allowedLocations: ['lt', 'rt'],
    maxPerMech: 1,
  },

  // ── DLC BUILT-IN EQUIPMENT (fixed on specific mechs) ───────────────────────

  {
    id: 18,
    name: 'X-1 EW Equipment',
    category: 'Sensor',
    tonnage: 7.5,
    criticalSlots: 4,
    effectDescription: 'Combined ECM field (missile defense, indirect fire immunity, stealth) and active probe.',
    isClan: false,
    dlcSource: 'Urban Warfare',
    gameId: 'Gear_Sensor_Prototype_EWE',
    builtInOn: ['RVN-1X', 'RVN-3X', 'CTF-0X'],
  },
  {
    id: 19,
    name: 'Hatchet',
    category: 'Actuator',
    tonnage: 3,
    criticalSlots: 3,
    effectDescription: 'Prototype melee weapon fixed to the right arm. Melee damage +70.',
    isClan: false,
    dlcSource: 'Flashpoint',
    gameId: 'Gear_Actuator_Prototype_Hatchet',
    builtInOn: ['HCT-3F', 'HCT-3X'],
  },
  {
    id: 20,
    name: 'Battle Computer',
    category: 'Cockpit',
    tonnage: 0,
    criticalSlots: 1,
    effectDescription: 'Tacticon B2000. Whole lance gains +1 Initiative. Stacks with Master Tactician.',
    isClan: false,
    dlcSource: 'Flashpoint',
    gameId: 'Gear_Cockpit_Tacticon_B2000_Battle_Computer',
    builtInOn: ['CP-10-HQ', 'CP-10-Z'],
  },
  {
    id: 21,
    name: 'Advanced Command Module',
    category: 'Other',
    tonnage: 8,
    criticalSlots: 6,
    effectDescription: 'Whole lance takes 10% less damage and gains +1 accuracy.',
    isClan: false,
    dlcSource: 'Flashpoint',
    gameId: 'Gear_General_Advanced_Command_Module',
    builtInOn: ['CP-10-HQ'],
  },
  {
    id: 22,
    name: 'BSC System',
    category: 'Upgrade',
    tonnage: 0,
    criticalSlots: 1,
    effectDescription: 'Ballistic Siege Compensators. Ballistic weapon damage x1.2, max stability +40.',
    isClan: false,
    dlcSource: 'Heavy Metal',
    gameId: 'Gear_General_GM_Ballistic_Siege_Compensators',
    builtInOn: ['ANH-1A', 'ANH-JH'],
  },
  {
    id: 23,
    name: 'Missilery Suite',
    category: 'Upgrade',
    tonnage: 0,
    criticalSlots: 1,
    effectDescription: 'Enhanced Missilery System. LRM clustering +16, missile stability damage x1.5.',
    isClan: false,
    dlcSource: 'Heavy Metal',
    gameId: 'Gear_General_Enhanced_Missilery_System',
    builtInOn: ['ARC-2R', 'ARC-2S', 'ARC-LS', 'ARC-XO'],
  },
  {
    id: 24,
    name: 'Intercept System',
    category: 'Upgrade',
    tonnage: 0,
    criticalSlots: 3,
    effectDescription: 'Predictive tracking. Weapons ignore 3 EVASIVE charges on the target.',
    isClan: false,
    dlcSource: 'Heavy Metal',
    gameId: 'Gear_General_Intercept_System',
    builtInOn: ['ASN-101', 'ASN-21'],
  },
  {
    id: 25,
    name: 'Thumper Cannon',
    category: 'Upgrade',
    tonnage: 10,
    criticalSlots: 8,
    effectDescription: 'Integrated heavy artillery. Area damage to every unit in the target zone. Only one artillery piece per mech.',
    isClan: false,
    dlcSource: 'Heavy Metal',
    gameId: 'Gear_Mortar_Thumper',
    builtInOn: ['BSK-MAZ'],
  },
  {
    id: 26,
    name: 'Targeting Baffle',
    category: 'Upgrade',
    tonnage: 0,
    criticalSlots: 3,
    effectDescription: 'Shaped torso sections. Enemies take +1 to-hit penalty against this mech.',
    isClan: false,
    dlcSource: 'Heavy Metal',
    gameId: 'Gear_General_Targeting_Baffle',
    builtInOn: ['FLE-15', 'FLE-4'],
  },
  {
    id: 27,
    name: 'Vectored Thrust Kit',
    category: 'Jump Jet',
    tonnage: 0.5,
    criticalSlots: 2,
    effectDescription: 'Works as a jump jet. Jump distance +10%, weapon damage after jumping +10%.',
    isClan: false,
    dlcSource: 'Heavy Metal',
    gameId: 'Gear_JumpJet_Vectored_Thrust_Kit',
    builtInOn: ['PXH-1', 'PXH-1K', 'PXH-1b'],
  },
  {
    id: 28,
    name: 'Rangefinder Suite',
    category: 'Upgrade',
    tonnage: 0,
    criticalSlots: 1,
    effectDescription: 'Spotting range +100m, long range accuracy penalty -2, recoil penalty -2.',
    isClan: false,
    dlcSource: 'Heavy Metal',
    gameId: 'Gear_General_Rangefinder_Suite',
    builtInOn: ['RFL-3C', 'RFL-3N', 'RFL-4D', 'RFL-RIP'],
  },
  {
    id: 29,
    name: 'CQC Suite',
    category: 'Upgrade',
    tonnage: 0,
    criticalSlots: 2,
    effectDescription: 'Close-Quarters Combat Suite. Support weapon range +90m, +10 defense against melee.',
    isClan: false,
    dlcSource: 'Heavy Metal',
    gameId: 'Gear_General_Close_Quarters_Combat_Suite',
    builtInOn: ['VL-2T', 'VL-5T'],
  },
];
