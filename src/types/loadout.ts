import type { Weapon } from '@/data/weapons';
import type { Mech } from '@/data/mechs';
import type { AmmoBin, HeatSink, JumpJet } from '@/data/loadoutEquipment';

export type HardpointType = 'B' | 'E' | 'M' | 'S';
export type LocationKey = 'hd' | 'ct' | 'lt' | 'rt' | 'la' | 'ra' | 'll' | 'rl';

export type SlotItem =
  | { kind: 'weapon'; data: Weapon }
  | { kind: 'ammo'; data: AmmoBin }
  | { kind: 'heatSink'; data: HeatSink }
  | { kind: 'jumpJet'; data: JumpJet };

export interface SlotAssignment {
  hardpointType: HardpointType;
  weapon: Weapon | null;
}

/** A generic inventory slot that can hold any equipment item */
export interface EquipmentSlot {
  item: SlotItem | null;
  /** How many consecutive inventory cells this item occupies (set when filled) */
  slotsUsed: number;
}

export interface LoadoutState {
  selectedMech: Mech | null;
  slots: Record<LocationKey, SlotAssignment[]>;
  equipment: Record<LocationKey, EquipmentSlot[]>;
}

export const LOCATION_LABELS: Record<LocationKey, string> = {
  hd: 'HD', ct: 'CT', lt: 'LT', rt: 'RT',
  la: 'LA', ra: 'RA', ll: 'LL', rl: 'RL',
};

export const HARDPOINT_TYPE_LABELS: Record<HardpointType, string> = {
  B: 'BALLISTIC',
  E: 'ENERGY',
  M: 'MISSILE',
  S: 'SUPPORT',
};

export const HARDPOINT_TO_CATEGORY: Record<HardpointType, string> = {
  B: 'Ballistic',
  E: 'Energy',
  M: 'Missile',
  S: 'Support',
};

export const EMPTY_SLOTS: Record<LocationKey, SlotAssignment[]> = {
  hd: [], ct: [], lt: [], rt: [],
  la: [], ra: [], ll: [], rl: [],
};

export const EMPTY_EQUIPMENT: Record<LocationKey, EquipmentSlot[]> = {
  hd: [], ct: [], lt: [], rt: [],
  la: [], ra: [], ll: [], rl: [],
};
