import type { LoadoutState, LocationKey } from '@/types/loadout';

interface StatsBarProps {
  state: LoadoutState;
  hasOverweight?: boolean;
}

const StatsBar = ({ state, hasOverweight }: StatsBarProps) => {
  const { selectedMech, slots } = state;
  if (!selectedMech) return null;

  let tonnageUsed = 0;
  let heatGenerated = 0;
  let critSlotsUsed = 0;

  const allLocations = Object.keys(slots) as LocationKey[];
  for (const loc of allLocations) {
    for (const slot of slots[loc]) {
      if (slot.weapon) {
        tonnageUsed += slot.weapon.tonnage;
        heatGenerated += slot.weapon.heat;
        critSlotsUsed += slot.weapon.criticalSlots;
      }
    }
  }

  const totalSlots = allLocations.reduce((sum, loc) => sum + slots[loc].length, 0);

  const stats = [
    { label: 'TONNAGE', value: `${tonnageUsed} / ${selectedMech.tonnage}t` },
    { label: 'HEAT', value: `${heatGenerated} heat` },
    { label: 'SLOTS', value: `${critSlotsUsed} / ${totalSlots} slots` },
  ];

  return (
    <div className="grid grid-cols-3 gap-2 p-3 bg-card border border-border rounded-sm">
      {stats.map((s) => (
        <div key={s.label} className="text-center">
          <div className="font-mono uppercase tracking-wider" style={{ fontSize: 'var(--fs-badge)', color: (hasOverweight && s.label === 'TONNAGE') ? '#E05050' : undefined }}>
            {s.label}
          </div>
          <div className="font-mono font-semibold" style={{ fontSize: 'var(--fs-body)', color: (hasOverweight && s.label === 'TONNAGE') ? '#E05050' : undefined }}>
            {s.value}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsBar;
