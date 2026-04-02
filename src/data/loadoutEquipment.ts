export interface AmmoBin {
  id: string;
  name: string;
  ammoId: string;
  capacity: number;
  tonnage: number;
  slots: number;
  canExplode: boolean;
  isLosTech: boolean;
}

export interface HeatSink {
  id: string;
  name: string;
  subType: 'Standard' | 'HeatBank' | 'Exchanger';
  slots: number;
  tonnage: number;
  dissipation: number;
  maxHeatBonus: number;
  overheatBonus: number;
  weaponHeatReduction: number;
  isLosTech: boolean;
  heatReductionPct?: number;
}

export interface JumpJet {
  id: string;
  name: string;
  slots: number;
  tonnage: number;
  minTonnage: number;
  maxTonnage: number;
  allowedLocations: ('CT' | 'LT' | 'RT' | 'LL' | 'RL')[];
}

export const AMMO_BINS: AmmoBin[] = [
  {
    id: 'Ammo_AmmunitionBox_Generic_AC2',
    name: 'AC/2 Ammo',
    ammoId: 'AC',
    capacity: 25,
    tonnage: 1,
    slots: 1,
    canExplode: true,
    isLosTech: false,
  },
  {
    id: 'Ammo_AmmunitionBox_Generic_AC5',
    name: 'AC/5 Ammo',
    ammoId: 'AC',
    capacity: 15,
    tonnage: 1,
    slots: 1,
    canExplode: true,
    isLosTech: false,
  },
  {
    id: 'Ammo_AmmunitionBox_Generic_AC10',
    name: 'AC/10 Ammo',
    ammoId: 'AC',
    capacity: 8,
    tonnage: 1,
    slots: 1,
    canExplode: true,
    isLosTech: false,
  },
  {
    id: 'Ammo_AmmunitionBox_Generic_AC20',
    name: 'AC/20 Ammo',
    ammoId: 'AC',
    capacity: 5,
    tonnage: 1,
    slots: 1,
    canExplode: true,
    isLosTech: false,
  },
  {
    id: 'Ammo_AmmunitionBox_Generic_LRM',
    name: 'LRM Ammo',
    ammoId: 'LRM',
    capacity: 120,
    tonnage: 1,
    slots: 1,
    canExplode: true,
    isLosTech: false,
  },
  {
    id: 'Ammo_AmmunitionBox_Generic_SRM',
    name: 'SRM Ammo',
    ammoId: 'SRM',
    capacity: 100,
    tonnage: 1,
    slots: 1,
    canExplode: true,
    isLosTech: false,
  },
  {
    id: 'Ammo_AmmunitionBox_Generic_GAUSS',
    name: 'Gauss Ammo',
    ammoId: 'Gauss',
    capacity: 8,
    tonnage: 1,
    slots: 1,
    canExplode: false,
    isLosTech: true,
  },
  {
    id: 'Ammo_AmmunitionBox_Generic_MG',
    name: 'MG Ammo',
    ammoId: 'MG',
    capacity: 200,
    tonnage: 1,
    slots: 1,
    canExplode: true,
    isLosTech: false,
  },
  {
    id: 'Ammo_AmmunitionBox_Generic_MG_Half',
    name: 'MG Ammo (Half)',
    ammoId: 'MG',
    capacity: 100,
    tonnage: 0.5,
    slots: 1,
    canExplode: true,
    isLosTech: false,
  },
];

export const HEAT_SINKS: HeatSink[] = [
  {
    id: 'Gear_HeatSink_Generic_Standard',
    name: 'Heat Sink',
    subType: 'Standard',
    slots: 1,
    tonnage: 1,
    dissipation: 3,
    maxHeatBonus: 0,
    overheatBonus: 0,
    weaponHeatReduction: 1.0,
    isLosTech: false,
  },
  {
    id: 'Gear_HeatSink_Generic_Double',
    name: 'Heat Sink (D)',
    subType: 'Standard',
    slots: 3,
    tonnage: 1,
    dissipation: 6,
    maxHeatBonus: 0,
    overheatBonus: 0,
    weaponHeatReduction: 1.0,
    isLosTech: true,
  },
  {
    id: 'Gear_HeatSink_Generic_Standard-Bank',
    name: 'Heat Bank',
    subType: 'HeatBank',
    slots: 2,
    tonnage: 1,
    dissipation: 0,
    maxHeatBonus: 10,
    overheatBonus: 5,
    weaponHeatReduction: 1.0,
    isLosTech: false,
  },
  {
    id: 'Gear_HeatSink_Generic_Improved-Bank',
    name: 'Heat Bank +',
    subType: 'HeatBank',
    slots: 4,
    tonnage: 1,
    dissipation: 0,
    maxHeatBonus: 20,
    overheatBonus: 10,
    weaponHeatReduction: 1.0,
    isLosTech: false,
  },
  {
    id: 'Gear_HeatSink_Generic_Bulk-Bank',
    name: 'Heat Bank ++',
    subType: 'HeatBank',
    slots: 6,
    tonnage: 1,
    dissipation: 0,
    maxHeatBonus: 30,
    overheatBonus: 15,
    weaponHeatReduction: 1.0,
    isLosTech: false,
  },
  {
    id: 'Gear_HeatSink_Generic_Thermal-Exchanger-I',
    name: 'Exchanger',
    subType: 'Exchanger',
    slots: 1,
    tonnage: 2,
    dissipation: 0,
    maxHeatBonus: 0,
    overheatBonus: 0,
    weaponHeatReduction: 0.9,
    isLosTech: false,
  },
  {
    id: 'Gear_HeatSink_Generic_Thermal-Exchanger-II',
    name: 'Exchanger +',
    subType: 'Exchanger',
    slots: 1,
    tonnage: 3,
    dissipation: 0,
    maxHeatBonus: 0,
    overheatBonus: 0,
    weaponHeatReduction: 0.85,
    isLosTech: false,
  },
  {
    id: 'Gear_HeatSink_Generic_Thermal-Exchanger-III',
    name: 'Exchanger ++',
    subType: 'Exchanger',
    slots: 1,
    tonnage: 4,
    dissipation: 0,
    maxHeatBonus: 0,
    overheatBonus: 0,
    weaponHeatReduction: 0.8,
    isLosTech: false,
  },
];

export const JUMP_JETS: JumpJet[] = [
  {
    id: 'Gear_JumpJet_Generic_Standard',
    name: 'Jump Jet (S)',
    slots: 1,
    tonnage: 0.5,
    minTonnage: 10,
    maxTonnage: 55,
    allowedLocations: ['CT', 'LT', 'RT', 'LL', 'RL'],
  },
  {
    id: 'Gear_JumpJet_Generic_Heavy',
    name: 'Jump Jet (H)',
    slots: 1,
    tonnage: 1,
    minTonnage: 60,
    maxTonnage: 85,
    allowedLocations: ['CT', 'LT', 'RT', 'LL', 'RL'],
  },
  {
    id: 'Gear_JumpJet_Generic_Assault',
    name: 'Jump Jet (A)',
    slots: 1,
    tonnage: 2,
    minTonnage: 90,
    maxTonnage: 100,
    allowedLocations: ['CT', 'LT', 'RT', 'LL', 'RL'],
  },
];
