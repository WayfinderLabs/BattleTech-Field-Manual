export interface Equipment {
  id: string;
  name: string;
  category: 'Heat Sink' | 'Jump Jet' | 'Sensor' | 'Actuator' | 'Other';
  tonnage: number;
  criticalSlots: number;
  effectDescription: string;
  isClan: boolean;
}

const EQUIPMENT: Equipment[] = [
  {
    id: 'single-heat-sink',
    name: 'Single Heat Sink',
    category: 'Heat Sink',
    tonnage: 1,
    criticalSlots: 1,
    effectDescription: 'Dissipates 3 heat per turn.',
    isClan: false,
  },
  {
    id: 'double-heat-sink',
    name: 'Double Heat Sink',
    category: 'Heat Sink',
    tonnage: 1,
    criticalSlots: 2,
    effectDescription: 'Dissipates 6 heat per turn. Twice as efficient as standard.',
    isClan: false,
  },
  {
    id: 'clan-double-heat-sink',
    name: 'Clan Double Heat Sink',
    category: 'Heat Sink',
    tonnage: 1,
    criticalSlots: 2,
    effectDescription: 'Dissipates 6 heat per turn. Clan-spec, identical performance to IS DHS.',
    isClan: true,
  },
  {
    id: 'jump-jet-light',
    name: 'Jump Jet (Light)',
    category: 'Jump Jet',
    tonnage: 0.5,
    criticalSlots: 1,
    effectDescription: 'Enables jump movement for light mechs (20–35 tons).',
    isClan: false,
  },
  {
    id: 'jump-jet-medium',
    name: 'Jump Jet (Medium)',
    category: 'Jump Jet',
    tonnage: 1,
    criticalSlots: 1,
    effectDescription: 'Enables jump movement for medium mechs (40–55 tons).',
    isClan: false,
  },
  {
    id: 'jump-jet-heavy',
    name: 'Jump Jet (Heavy)',
    category: 'Jump Jet',
    tonnage: 1.5,
    criticalSlots: 1,
    effectDescription: 'Enables jump movement for heavy mechs (60–75 tons).',
    isClan: false,
  },
  {
    id: 'jump-jet-assault',
    name: 'Jump Jet (Assault)',
    category: 'Jump Jet',
    tonnage: 2,
    criticalSlots: 1,
    effectDescription: 'Enables jump movement for assault mechs (80–100 tons).',
    isClan: false,
  },
  {
    id: 'guardian-ecm',
    name: 'Guardian ECM Suite',
    category: 'Sensor',
    tonnage: 1.5,
    criticalSlots: 2,
    effectDescription: 'Disrupts enemy electronics. Reduces indirect fire accuracy against nearby allies.',
    isClan: false,
  },
  {
    id: 'beagle-active-probe',
    name: 'Beagle Active Probe',
    category: 'Sensor',
    tonnage: 1.5,
    criticalSlots: 2,
    effectDescription: 'Extends sensor range. Detects shutdown and hidden units.',
    isClan: false,
  },
  {
    id: 'clan-active-probe',
    name: 'Clan Active Probe',
    category: 'Sensor',
    tonnage: 1,
    criticalSlots: 1,
    effectDescription: 'Clan-spec active probe. Lighter and more compact than IS variant.',
    isClan: true,
  },
  {
    id: 'tag-equipment',
    name: 'Target Acquisition Gear (TAG)',
    category: 'Sensor',
    tonnage: 1,
    criticalSlots: 1,
    effectDescription: 'Designates target for allied indirect fire. Improves missile accuracy.',
    isClan: false,
  },
  {
    id: 'masc',
    name: 'MASC',
    category: 'Actuator',
    tonnage: 2,
    criticalSlots: 2,
    effectDescription: 'Myomer Accelerator Signal Circuitry. Temporarily boosts sprint speed. Risk of leg damage.',
    isClan: false,
  },
  {
    id: 'clan-masc',
    name: 'Clan MASC',
    category: 'Actuator',
    tonnage: 1.5,
    criticalSlots: 2,
    effectDescription: 'Clan-spec MASC. Lighter than IS variant. Same speed boost and leg damage risk.',
    isClan: true,
  },
  {
    id: 'ferro-fibrous-armor',
    name: 'Ferro-Fibrous Armor',
    category: 'Other',
    tonnage: 0,
    criticalSlots: 14,
    effectDescription: '12% more armor per ton than standard. Requires 14 critical slots across the mech.',
    isClan: false,
  },
  {
    id: 'endo-steel-structure',
    name: 'Endo-Steel Structure',
    category: 'Other',
    tonnage: 0,
    criticalSlots: 14,
    effectDescription: 'Halves internal structure weight. Requires 14 critical slots across the mech.',
    isClan: false,
  },
];

export default EQUIPMENT;
