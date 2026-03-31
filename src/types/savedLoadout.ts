import type { SlotAssignment, EquipmentSlot, LocationKey } from '@/types/loadout';

export interface SavedLoadout {
  id: string;
  name: string;
  notes?: string;
  mechId: string;
  slots: Record<string, SlotAssignment[]>;
  equipment: Record<string, EquipmentSlot[]>;
  savedAt: number;
}
