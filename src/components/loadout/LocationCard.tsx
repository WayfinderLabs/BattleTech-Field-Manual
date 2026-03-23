import type { SlotAssignment, HardpointType } from '@/types/loadout';
import { HARDPOINT_TYPE_LABELS } from '@/types/loadout';

interface LocationCardProps {
  label: string;
  hardpointStr: string;
  slots: SlotAssignment[];
  onAddWeapon: (slotIndex: number, hardpointType: HardpointType) => void;
  onRemoveWeapon: (slotIndex: number) => void;
}

const LocationCard = ({ label, hardpointStr, slots, onAddWeapon, onRemoveWeapon }: LocationCardProps) => {
  const isEmpty = slots.length === 0;

  return (
    <div className={`border border-border rounded-sm p-3 ${isEmpty ? 'opacity-40' : 'bg-card'}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono uppercase tracking-wider text-muted-foreground font-semibold" style={{ fontSize: 'var(--fs-card-title)' }}>
          {label}
        </span>
        <span className="font-mono text-muted-foreground" style={{ fontSize: 'var(--fs-badge)' }}>
          {hardpointStr}
        </span>
      </div>

      {isEmpty ? (
        <div className="font-mono text-muted-foreground uppercase tracking-wider text-center py-2" style={{ fontSize: 'var(--fs-badge)' }}>
          NO HARDPOINTS
        </div>
      ) : (
        <div className="space-y-1.5">
          {slots.map((slot, i) => (
            <div key={i} className="flex items-center justify-between gap-2 p-2 border border-border rounded-sm bg-background">
              {slot.weapon ? (
                <>
                  <div className="flex-1 min-w-0">
                    <div className="font-mono uppercase tracking-wider text-foreground truncate" style={{ fontSize: 'var(--fs-badge)' }}>
                      {slot.weapon.name}
                    </div>
                    <div className="font-mono text-muted-foreground flex gap-2" style={{ fontSize: 'clamp(0.5625rem, 2.2vw, 0.75rem)' }}>
                      <span className="text-primary">{slot.weapon.damage}D</span>
                      <span className="text-destructive">{slot.weapon.heat}H</span>
                      <span>{slot.weapon.tonnage}T</span>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveWeapon(i)}
                    className="text-muted-foreground hover:text-foreground font-mono shrink-0 px-1"
                    style={{ fontSize: 'var(--fs-body)' }}
                  >
                    ✕
                  </button>
                </>
              ) : (
                <>
                  <span className="font-mono uppercase tracking-wider text-muted-foreground" style={{ fontSize: 'var(--fs-badge)' }}>
                    {HARDPOINT_TYPE_LABELS[slot.hardpointType]} SLOT
                  </span>
                  <button
                    onClick={() => onAddWeapon(i, slot.hardpointType)}
                    className="font-mono text-primary hover:text-primary/80 shrink-0"
                    style={{ fontSize: 'var(--fs-badge)' }}
                  >
                    ＋ ADD
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationCard;
