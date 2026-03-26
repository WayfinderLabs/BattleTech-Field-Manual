import type { SlotAssignment, HardpointType } from '@/types/loadout';
import { HP_PILL_COLORS, parseHardpointTokens } from '@/utils/hardpointPills';

interface LocationCardProps {
  label: string;
  hardpointStr: string;
  slots: SlotAssignment[];
  inventorySlots: number;
  onOpenPicker: () => void;
  onRemoveWeapon: (slotIndex: number) => void;
  hasCritOverflow?: boolean;
}

interface SlotBlock {
  type: 'empty' | 'first' | 'continuation';
  weaponName?: string;
  slotIndex?: number;
}

const LocationCard = ({ label, hardpointStr, slots, inventorySlots, onOpenPicker, onRemoveWeapon, hasCritOverflow }: LocationCardProps) => {
  const isEmpty = slots.length === 0;

  // Build flat slot block array
  const blocks: SlotBlock[] = [];
  if (!isEmpty) {
    let blockIndex = 0;
    for (let i = 0; i < slots.length; i++) {
      const slot = slots[i];
      if (slot.weapon) {
        for (let c = 0; c < slot.weapon.criticalSlots; c++) {
          if (blockIndex < inventorySlots) {
            blocks.push({
              type: c === 0 ? 'first' : 'continuation',
              weaponName: slot.weapon.name,
              slotIndex: i,
            });
            blockIndex++;
          }
        }
      }
    }
    // Fill remaining visual blocks as empty
    while (blockIndex < inventorySlots) {
      blocks.push({ type: 'empty' });
      blockIndex++;
    }
  }

  const allFull = !isEmpty && slots.every(s => !!s.weapon);

  return (
    <div
      className="border rounded-sm p-3"
      style={{
        borderColor: hasCritOverflow ? '#E05050' : 'hsl(var(--border))',
        backgroundColor: isEmpty ? 'transparent' : 'hsl(var(--card))',
        opacity: isEmpty ? 0.4 : 1,
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono uppercase tracking-wider text-muted-foreground font-semibold" style={{ fontSize: 'var(--fs-card-title)' }}>
          {label}
        </span>
      </div>

      {/* Hardpoint type pills */}
      {!isEmpty && (
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

      {isEmpty ? (
        <div className="font-mono text-muted-foreground uppercase tracking-wider text-center py-2" style={{ fontSize: 'var(--fs-badge)' }}>
          NO HARDPOINTS
        </div>
      ) : (
        <div>
          {blocks.map((block, i) => {
            if (block.type === 'first') {
              return (
                <div
                  key={i}
                  className="flex items-center justify-between"
                  style={{
                    height: 18,
                    borderRadius: 2,
                    marginBottom: 2,
                    backgroundColor: hasCritOverflow ? '#E05050' : '#C87941',
                    border: `1px solid ${hasCritOverflow ? '#E05050' : '#C87941'}`,
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
                    {block.weaponName}
                  </span>
                  <button
                    onClick={() => block.slotIndex !== undefined && onRemoveWeapon(block.slotIndex)}
                    className="shrink-0 font-mono"
                    style={{ fontSize: 10, color: '#0D0D0D', lineHeight: 1 }}
                  >
                    ✕
                  </button>
                </div>
              );
            }
            if (block.type === 'continuation') {
              return (
                <div
                  key={i}
                  style={{
                    height: 18,
                    borderRadius: 2,
                    marginBottom: 2,
                    backgroundColor: hasCritOverflow ? '#8A2020' : '#7A4A28',
                    border: `1px solid ${hasCritOverflow ? '#E05050' : '#7A4A28'}`,
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

          {/* Single ADD / FULL button */}
          <button
            onClick={() => !allFull && onOpenPicker()}
            disabled={allFull}
            className={`w-full mt-2 py-1 font-mono uppercase tracking-wider rounded-sm border transition-colors ${
              allFull
                ? 'border-border text-muted-foreground/40 cursor-not-allowed'
                : 'border-primary text-primary hover:bg-primary/10 cursor-pointer'
            }`}
            style={{ fontSize: 'var(--fs-badge)' }}
          >
            {allFull ? 'FULL' : '+ ADD'}
          </button>
        </div>
      )}
    </div>
  );
};

export default LocationCard;
