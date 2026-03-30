import { useState, useMemo, useRef } from 'react';
import { X } from 'lucide-react';
import { WEAPONS, type Weapon } from '@/data/weapons';
import type { SlotAssignment, HardpointType, LocationKey } from '@/types/loadout';
import { LOCATION_LABELS, HARDPOINT_TYPE_LABELS } from '@/types/loadout';
import { HP_PILL_COLORS } from '@/utils/hardpointPills';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';

type CategoryFilter = Weapon['category'] | 'ALL';

const CATEGORY_COLORS: Record<Weapon['category'], string> = {
  Ballistic: 'bg-[hsl(220,9%,46%)] text-white',
  Energy: 'bg-[hsl(217,91%,60%)] text-white',
  Missile: 'bg-[hsl(142,71%,45%)] text-black',
  Support: 'bg-[hsl(48,96%,53%)] text-black',
};

const HP_TO_CATEGORY: Record<HardpointType, Weapon['category']> = {
  B: 'Ballistic', E: 'Energy', M: 'Missile', S: 'Support',
};

const CATEGORY_TO_HP: Record<Weapon['category'], HardpointType> = {
  Ballistic: 'B', Energy: 'E', Missile: 'M', Support: 'S',
};

interface UnifiedWeaponPickerProps {
  open: boolean;
  locationKey: LocationKey;
  slots: SlotAssignment[];
  onClose: () => void;
  onAdd: (weapon: Weapon, slotIndex: number) => void;
}

const UnifiedWeaponPicker = ({ open, locationKey, slots, onClose, onAdd }: UnifiedWeaponPickerProps) => {
  const [filter, setFilter] = useState<CategoryFilter>('ALL');
  const [search, setSearch] = useState('');

  // Compute remaining slots by type
  const remaining = useMemo(() => {
    const counts: Partial<Record<HardpointType, number>> = {};
    for (const slot of slots) {
      if (!slot.weapon) {
        counts[slot.hardpointType] = (counts[slot.hardpointType] || 0) + 1;
      }
    }
    return counts;
  }, [slots]);

  // Available categories (those that have at least one slot total, filled or not)
  const allCategories = useMemo(() => {
    const types = new Set<HardpointType>();
    for (const slot of slots) types.add(slot.hardpointType);
    return Array.from(types);
  }, [slots]);

  // Remaining pills for display
  const remainingPills = useMemo(() => {
    const pills: HardpointType[] = [];
    for (const slot of slots) {
      if (!slot.weapon) pills.push(slot.hardpointType);
    }
    return pills;
  }, [slots]);

  // Available categories with remaining > 0
  const availableCategories = useMemo(() => {
    return new Set(Object.entries(remaining).filter(([, c]) => c! > 0).map(([t]) => HP_TO_CATEGORY[t as HardpointType]));
  }, [remaining]);

  // Filter chips to show
  const chips = useMemo(() => {
    const cats: CategoryFilter[] = ['ALL'];
    for (const hp of allCategories) {
      cats.push(HP_TO_CATEGORY[hp]);
    }
    return cats;
  }, [allCategories]);

  // Filtered weapons
  const filtered = useMemo(() => {
    return WEAPONS.filter((w) => {
      // Must match an available (remaining > 0) category
      if (!availableCategories.has(w.category)) return false;
      // Filter chip
      if (filter !== 'ALL' && w.category !== filter) return false;
      // Search
      if (search && !w.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [filter, search, availableCategories]);

  const flashingCard = useRef<string | null>(null);
  const [flashId, setFlashId] = useState<string | null>(null);

  const handleAdd = (weapon: Weapon) => {
    const hpType = CATEGORY_TO_HP[weapon.category];
    const slotIndex = slots.findIndex(s => s.hardpointType === hpType && !s.weapon);
    if (slotIndex === -1) return;

    // Flash then add
    setFlashId(weapon.id);
    flashingCard.current = weapon.id;
    setTimeout(() => {
      setFlashId(null);
      flashingCard.current = null;
      onAdd(weapon, slotIndex);
    }, 250);
  };

  // Reset filter on open change
  const handleOpenChange = (o: boolean) => {
    if (!o) {
      onClose();
      setFilter('ALL');
      setSearch('');
    }
  };

  const locationLabel = LOCATION_LABELS[locationKey];
  const allFull = remainingPills.length === 0;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-w-lg p-0 border gap-0"
        style={{
          backgroundColor: '#161616',
          borderColor: '#2A2A2A',
          maxHeight: '80vh',
        }}
      >
        <DialogHeader className="p-4 pb-2">
          <DialogTitle
            className="font-mono uppercase tracking-wider"
            style={{ fontSize: 'var(--fs-card-title)', color: '#C87941' }}
          >
            {locationLabel} — ADD WEAPON
          </DialogTitle>
        </DialogHeader>

        <div className="px-4 space-y-3">
          {/* Remaining slots summary */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono uppercase tracking-wider text-muted-foreground" style={{ fontSize: 11 }}>
              SLOTS REMAINING:
            </span>
            {remainingPills.length === 0 ? (
              <span className="font-mono uppercase" style={{ fontSize: 11, color: '#8A8A8A' }}>NONE</span>
            ) : (
              remainingPills.map((hp, i) => (
                <span
                  key={i}
                  className={`px-1 py-0.5 font-mono rounded-sm ${HP_PILL_COLORS[hp] || ''}`}
                  style={{ fontSize: 10 }}
                >
                  {hp}
                </span>
              ))
            )}
          </div>

          {/* Search */}
          <input
            type="text"
            placeholder="Search weapons..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-secondary border border-border rounded-sm px-3 py-2 font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            style={{ fontSize: 'var(--fs-body)' }}
          />

          {/* Filter chips */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {chips.map((chip) => {
              const isAll = chip === 'ALL';
              const disabled = !isAll && !availableCategories.has(chip as Weapon['category']);
              const active = filter === chip;
              return (
                <button
                  key={chip}
                  onClick={() => !disabled && setFilter(chip)}
                  disabled={disabled}
                  className={`shrink-0 px-3 py-1 font-mono uppercase tracking-wider rounded-sm border transition-colors ${
                    active
                      ? 'bg-primary text-primary-foreground border-primary'
                      : disabled
                        ? 'bg-card text-muted-foreground/40 border-border/40 cursor-not-allowed'
                        : 'bg-card text-muted-foreground border-border hover:border-primary/50'
                  }`}
                  style={{ fontSize: 'var(--fs-badge)' }}
                >
                  {chip}
                </button>
              );
            })}
          </div>
        </div>

        {/* Weapon list */}
        <div className="overflow-y-auto px-4 pb-4 pt-2" style={{ maxHeight: 'calc(80vh - 220px)' }}>
          {filtered.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <span className="font-mono uppercase" style={{ fontSize: 'var(--fs-body)', color: '#8A8A8A' }}>
                NO COMPATIBLE WEAPONS
              </span>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((w) => (
                <div
                  key={w.id}
                  className="bg-card border border-border rounded-sm p-3"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-primary font-mono uppercase tracking-wider leading-tight" style={{ fontSize: 'var(--fs-card-title)' }}>
                      {w.name}
                    </span>
                    <div className="flex gap-1.5 shrink-0 items-center">
                      <span className={`px-1.5 py-0.5 font-mono uppercase rounded-sm ${CATEGORY_COLORS[w.category]}`} style={{ fontSize: 'var(--fs-badge)' }}>
                        {w.category}
                      </span>
                      <button
                        onClick={() => handleAdd(w)}
                        className="px-2 py-1 font-mono uppercase tracking-wider rounded-sm border border-primary text-primary hover:bg-primary/10 transition-colors"
                        style={{ fontSize: 'var(--fs-badge)' }}
                      >
                        ADD
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    {[
                      { label: 'DMG', value: w.damage },
                      { label: 'HEAT', value: w.heat },
                      { label: 'TONS', value: w.tonnage },
                      { label: 'SLOTS', value: w.criticalSlots },
                    ].map((stat) => (
                      <div key={stat.label} className="bg-background border border-border rounded-sm px-2 py-1 text-center min-w-[42px]">
                        <div className="font-mono text-muted-foreground tracking-wider" style={{ fontSize: 'var(--fs-badge)' }}>{stat.label}</div>
                        <div className="font-mono text-foreground" style={{ fontSize: 'var(--fs-body)' }}>{stat.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UnifiedWeaponPicker;
