import type { SlotAssignment, HardpointType } from '@/types/loadout';

/**
 * Parses a hardpoint string like "2B 1E" into SlotAssignment[].
 * "—" or empty returns [].
 */
export function parseHardpoints(hardpointStr: string): SlotAssignment[] {
  if (!hardpointStr || hardpointStr === '—') return [];

  const slots: SlotAssignment[] = [];
  const parts = hardpointStr.trim().split(/\s+/);

  for (const part of parts) {
    const match = part.match(/^(\d+)([BEMS])$/);
    if (!match) continue;
    const count = parseInt(match[1], 10);
    const type = match[2] as HardpointType;
    for (let i = 0; i < count; i++) {
      slots.push({ hardpointType: type, weapon: null });
    }
  }

  return slots;
}
