import { useState, useRef, useCallback } from 'react';
import { MECHS, type Mech } from '@/data/mechs';
import {
  Drawer, DrawerContent, DrawerHeader, DrawerTitle,
} from '@/components/ui/drawer';

interface MechPickerSheetProps {
  open: boolean;
  onClose: () => void;
  onSelect: (mech: Mech) => void;
}

const MechPickerSheet = ({ open, onClose, onSelect }: MechPickerSheetProps) => {
  const [search, setSearch] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const savedScrollTop = useRef(0);

  const filtered = MECHS.filter((m) => {
    const q = search.toLowerCase();
    return m.name.toLowerCase().includes(q) || m.variant.toLowerCase().includes(q);
  }).sort((a, b) => {
    if (a.tonnage !== b.tonnage) return a.tonnage - b.tonnage;
    return a.name.localeCompare(b.name);
  });

  const handleScroll = useCallback(() => {
    if (scrollRef.current) {
      savedScrollTop.current = scrollRef.current.scrollTop;
    }
  }, []);

  const handleAnimationEnd = useCallback(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = savedScrollTop.current;
    }
  }, [open]);

  return (
    <Drawer open={open} onOpenChange={(o) => !o && onClose()}>
      <DrawerContent className="max-h-[80vh]">
        <DrawerHeader>
          <DrawerTitle className="font-mono uppercase tracking-wider text-primary" style={{ fontSize: 'var(--fs-card-title)' }}>
            SELECT MECH
          </DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-2">
          <input
            type="text"
            placeholder="Search mechs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-secondary border border-border rounded-sm px-3 py-2 font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            style={{ fontSize: 'var(--fs-body)' }}
          />
        </div>
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          onTransitionEnd={handleAnimationEnd}
          className="overflow-y-auto px-4 pb-4 max-h-[60vh]"
        >
          {filtered.map((mech) => (
            <button
              key={mech.id}
              onClick={() => { onSelect(mech); onClose(); setSearch(''); }}
              className="w-full flex items-center justify-between gap-2 p-3 border border-border rounded-sm mb-2 bg-card hover:border-primary transition-colors text-left"
            >
              <div className="flex-1 min-w-0">
                <div className="font-mono uppercase tracking-wider text-foreground truncate" style={{ fontSize: 'var(--fs-body)' }}>
                  {mech.name}
                </div>
                <div className="font-mono text-muted-foreground" style={{ fontSize: 'var(--fs-badge)' }}>
                  {mech.variant}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="font-mono text-muted-foreground px-1.5 py-0.5 border border-border rounded-sm" style={{ fontSize: 'var(--fs-badge)' }}>
                  {mech.chassisClass}
                </span>
                <span className="font-mono text-primary" style={{ fontSize: 'var(--fs-badge)' }}>
                  {mech.tonnage}T
                </span>
              </div>
            </button>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MechPickerSheet;
