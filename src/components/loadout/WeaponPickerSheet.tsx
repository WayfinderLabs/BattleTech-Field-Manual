import { useState } from 'react';
import { WEAPONS, type Weapon } from '@/data/weapons';
import type { HardpointType } from '@/types/loadout';
import { HARDPOINT_TO_CATEGORY, HARDPOINT_TYPE_LABELS } from '@/types/loadout';
import {
  Drawer, DrawerContent, DrawerHeader, DrawerTitle,
} from '@/components/ui/drawer';

interface WeaponPickerSheetProps {
  open: boolean;
  hardpointType: HardpointType | null;
  onClose: () => void;
  onSelect: (weapon: Weapon) => void;
}

const WeaponPickerSheet = ({ open, hardpointType, onClose, onSelect }: WeaponPickerSheetProps) => {
  const [search, setSearch] = useState('');

  const category = hardpointType ? HARDPOINT_TO_CATEGORY[hardpointType] : null;
  const filtered = WEAPONS.filter((w) => {
    if (category && w.category !== category) return false;
    if (search) return w.name.toLowerCase().includes(search.toLowerCase());
    return true;
  });

  const typeLabel = hardpointType ? HARDPOINT_TYPE_LABELS[hardpointType] : 'WEAPON';

  return (
    <Drawer open={open} onOpenChange={(o) => !o && onClose()}>
      <DrawerContent className="max-h-[80vh]">
        <DrawerHeader>
          <DrawerTitle className="font-mono uppercase tracking-wider text-primary" style={{ fontSize: 'var(--fs-card-title)' }}>
            SELECT {typeLabel} WEAPON
          </DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-2">
          <input
            type="text"
            placeholder="Search weapons..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-secondary border border-border rounded-sm px-3 py-2 font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            style={{ fontSize: 'var(--fs-body)' }}
          />
        </div>
        <div className="overflow-y-auto px-4 pb-4 max-h-[60vh]">
          {filtered.map((weapon) => (
            <button
              key={weapon.id}
              onClick={() => { onSelect(weapon); onClose(); setSearch(''); }}
              className="w-full flex items-center justify-between gap-2 p-3 border border-border rounded-sm mb-2 bg-card hover:border-primary transition-colors text-left"
            >
              <div className="flex-1 min-w-0">
                <div className="font-mono uppercase tracking-wider text-foreground truncate" style={{ fontSize: 'var(--fs-body)' }}>
                  {weapon.name}
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0 font-mono" style={{ fontSize: 'var(--fs-badge)' }}>
                <span className="text-primary">{weapon.damage} DMG</span>
                <span className="text-destructive">{weapon.heat} HT</span>
                <span className="text-muted-foreground">{weapon.tonnage}T</span>
                <span className="text-muted-foreground">{weapon.criticalSlots}S</span>
              </div>
            </button>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default WeaponPickerSheet;
