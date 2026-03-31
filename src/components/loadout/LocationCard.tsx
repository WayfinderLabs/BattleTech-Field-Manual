import type { SlotAssignment, HardpointType, EquipmentSlot } from '@/types/loadout';
import { HP_PILL_COLORS, parseHardpointTokens } from '@/utils/hardpointPills';

interface LocationCardProps {
  label: string;
  hardpointStr: string;
  slots: SlotAssignment[];
  equipment: EquipmentSlot[];
  inventorySlots: number;
  onOpenPicker: () => void;
  onRemoveWeapon: (slotIndex: number) => void;
  onRemoveEquipment: (equipIndex: number) => void;
  hasCritOverflow?: boolean;
}

interface SlotBlock {
  type: 'empty' | 'first' | 'continuation';
  itemName?: string;
  /** For weapon removal */
  weaponSlotIndex?: number;
  /** For equipment removal */
  equipIndex?: number;
  isEquipment?: boolean;
  equipKind?: string;
}

/** Color for equipment item blocks */
const EQUIP_COLORS: Record<string, { first: string; cont: string }> = {
  ammo: { first: '#5A8A3A', cont: '#3A5A2A' },
  heatSink: { first: '#3A7A8A', cont: '#2A5A6A' },
  jumpJet: { first: '#7A5A8A', cont: '#5A3A6A' },
};

const LocationCard = ({
  label, hardpointStr, slots, equipment, inventorySlots,
  onOpenPicker, onRemoveWeapon, onRemoveEquipment, hasCritOverflow,
}: LocationCardProps) => {
  const isEmpty = slots.length === 0 && equipment.length === 0;
  const hasHardpoints = slots.length > 0;

  // Build flat slot block array
  const blocks: SlotBlock[] = [];
  let blockIndex = 0;

  // Weapon blocks
  for (let i = 0; i < slots.length; i++) {
    const slot = slots[i];
    if (slot.weapon) {
      for (let c = 0; c < slot.weapon.criticalSlots; c++) {
        if (blockIndex < inventorySlots) {
          blocks.push({
            type: c === 0 ? 'first' : 'continuation',
            itemName: slot.weapon.name,
            weaponSlotIndex: i,
          });
          blockIndex++;
        }
      }
    }
  }

  // Equipment blocks
  for (let i = 0; i < equipment.length; i++) {
    const eq = equipment[i];
    if (eq.item) {
      for (let c = 0; c < eq.slotsUsed; c++) {
        if (blockIndex < inventorySlots) {
          blocks.push({
            type: c === 0 ? 'first' : 'continuation',
            itemName: eq.item.data.name,
            equipIndex: i,
            isEquipment: true,
            equipKind: eq.item.kind,
          });
          blockIndex++;
        }
      }
    }
  }

  // Fill remaining
  while (blockIndex < inventorySlots) {
    blocks.push({ type: 'empty' });
    blockIndex++;
  }

  const allWeaponsFull = slots.length > 0 && slots.every(s => !!s.weapon);
  // Check if any inventory space remains
  const usedSlots = slots.reduce((sum, s) => sum + (s.weapon ? s.weapon.criticalSlots : 0), 0)
    + equipment.reduce((sum, eq) => sum + eq.slotsUsed, 0);
  const hasInventorySpace = usedSlots < inventorySlots;
  const showAddButton = hasHardpoints || hasInventorySpace;

  return (
    <div
      className="border rounded-sm p-3"
      style={{
        borderColor: hasCritOverflow ? '#E05050' : 'hsl(var(--border))',
        backgroundColor: (isEmpty && !hasHardpoints && inventorySlots === 0) ? 'transparent' : 'hsl(var(--card))',
        opacity: (isEmpty && !hasHardpoints && inventorySlots === 0) ? 0.4 : 1,
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono uppercase tracking-wider text-muted-foreground font-semibold" style={{ fontSize: 'var(--fs-card-title)' }}>
          {label}
        </span>
      </div>

      {/* Hardpoint type pills */}
      {hasHardpoints && (
        <div className="flex flex-wrap gap-1 mb-2">
          {(() => {
            const tokens = parseHardpointTokens(hardpointStr);
            if (tokens.length === 0) return <span className="font-mono text-muted-foreground" style={{ fontSize: 10 }}>—</span>;
            return tokens.flatMap((t, ti) =>
              Array.from({ length: t.count }, (_, i) => (
                <span
                  key={`${ti}-${i}`}
                  className={`px-1 py-0.5 font-mono rounded-sm text-[#E0E0E0] ${HP_PILL_COLORS[t.type] || ""}`}
                  style={{ fontSize: 10 }}
                >
                  {t.type}
                </span>
              ))
            );
          })()}
        </div>
      )}

      {inventorySlots === 0 && !hasHardpoints ? (
        <div className="font-mono text-muted-foreground uppercase tracking-wider text-center py-2" style={{ fontSize: 'var(--fs-badge)' }}>
          NO HARDPOINTS
        </div>
      ) : (
        <div>
          {blocks.map((block, i) => {
            if (block.type === 'first') {
              const colors = block.isEquipment && block.equipKind
                ? EQUIP_COLORS[block.equipKind] || { first: '#C87941', cont: '#7A4A28' }
                : { first: hasCritOverflow ? '#E05050' : '#C87941', cont: '' };
              return (
                <div
                  key={i}
                  className="flex items-center justify-between"
                  style={{
                    height: 18,
                    borderRadius: 2,
                    marginBottom: 2,
                    backgroundColor: hasCritOverflow && !block.isEquipment ? '#E05050' : colors.first,
                    border: `1px solid ${hasCritOverflow && !block.isEquipment ? '#E05050' : colors.first}`,
                    paddingLeft: 6,
                    paddingRight: 4,
                  }}
                >
                  <span
                    className="font-mono uppercase font-semibold"
                    style={{
                      fontSize: 10,
                      color: '#0D0D0D',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      flex: 1,
                    }}
                  >
                    {block.itemName}
                  </span>
                  <button
                    onClick={() => {
                      if (block.isEquipment && block.equipIndex !== undefined) {
                        onRemoveEquipment(block.equipIndex);
                      } else if (block.weaponSlotIndex !== undefined) {
                        onRemoveWeapon(block.weaponSlotIndex);
                      }
                    }}
                    className="shrink-0 font-mono"
                    style={{ fontSize: 10, color: '#0D0D0D', lineHeight: 1 }}
                  >
                    ✕
                  </button>
                </div>
              );
            }
            if (block.type === 'continuation') {
              const colors = block.isEquipment && block.equipKind
                ? EQUIP_COLORS[block.equipKind] || { first: '', cont: '#7A4A28' }
                : { first: '', cont: hasCritOverflow ? '#8A2020' : '#7A4A28' };
              return (
                <div
                  key={i}
                  style={{
                    height: 18,
                    borderRadius: 2,
                    marginBottom: 2,
                    backgroundColor: hasCritOverflow && !block.isEquipment ? '#8A2020' : colors.cont,
                    border: `1px solid ${hasCritOverflow && !block.isEquipment ? '#E05050' : colors.cont}`,
                  }}
                />
              );
            }
            return (
              <div
                key={i}
                style={{
                  height: 18,
                  borderRadius: 2,
                  marginBottom: 2,
                  backgroundColor: '#0D0D0D',
                  border: '1px solid #2A2A2A',
                }}
              />
            );
          })}

          {/* ADD / FULL button */}
          {showAddButton && (
            <button
              onClick={() => onOpenPicker()}
              disabled={!hasInventorySpace && allWeaponsFull}
              className={`w-full mt-2 py-1 font-mono uppercase tracking-wider rounded-sm border transition-colors ${
                !hasInventorySpace && allWeaponsFull
                  ? 'border-border text-muted-foreground/40 cursor-not-allowed'
                  : 'border-primary text-primary hover:bg-primary/10 cursor-pointer'
              }`}
              style={{ fontSize: 'var(--fs-badge)' }}
            >
              {!hasInventorySpace && allWeaponsFull ? 'FULL' : '+ ADD'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationCard;
