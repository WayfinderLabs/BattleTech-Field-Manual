import type { Weapon } from '@/data/weapons';
import type { Mech } from '@/data/mechs';

export type HardpointType = 'B' | 'E' | 'M' | 'S';
export type LocationKey = 'hd' | 'ct' | 'lt' | 'rt' | 'la' | 'ra' | 'll' | 'rl';

export interface SlotAssignment {
  hardpointType: HardpointType;
  weapon: Weapon | null;
}

export interface LoadoutState {
  selectedMech: Mech | null;
  slots: Record<LocationKey, SlotAssignment[]>;
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
