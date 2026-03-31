import type { LoadoutState, LocationKey, SlotItem } from '@/types/loadout';
import type { HeatSink } from '@/data/loadoutEquipment';

interface StatsBarProps {
  state: LoadoutState;
  hasOverweight?: boolean;
}

const StatsBar = ({ state, hasOverweight }: StatsBarProps) => {
  const { selectedMech, slots, equipment } = state;
  if (!selectedMech) return null;

  let tonnageUsed = 0;
  let heatGenerated = 0;
  let dissipation = 0;
  let jumpJetCount = 0;

  const allLocations = Object.keys(slots) as LocationKey[];
  for (const loc of allLocations) {
    for (const slot of slots[loc]) {
      if (slot.weapon) {
        tonnageUsed += slot.weapon.tonnage;
        heatGenerated += slot.weapon.heat;
      }
    }
    for (const eq of equipment[loc]) {
      if (eq.item) {
        tonnageUsed += eq.item.data.tonnage;
        if (eq.item.kind === 'heatSink') {
          const hs = eq.item.data as HeatSink;
          if (hs.subType === 'Standard') {
            dissipation += hs.dissipation;
          }
        }
        if (eq.item.kind === 'jumpJet') {
          jumpJetCount++;
        }
      }
    }
  }

  const jjMax = selectedMech.jumpJetsMax;

  const stats = [
    { label: 'TONNAGE', value: `${tonnageUsed} / ${selectedMech.tonnage}t`, warn: hasOverweight },
    { label: 'HEAT', value: `${heatGenerated} heat`, warn: false },
    { label: 'DISSIPATION', value: `${dissipation} / turn`, warn: false },
    { label: 'JUMP JETS', value: jjMax === 0 ? 'N/A' : `${jumpJetCount} / ${jjMax}`, warn: jumpJetCount > jjMax },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 p-3 bg-card border border-border rounded-sm">
      {stats.map((s) => (
        <div key={s.label} className="text-center">
          <div className="font-mono uppercase tracking-wider" style={{ fontSize: 'var(--fs-badge)', color: s.warn ? '#E05050' : undefined }}>
            {s.label}
          </div>
          <div className="font-mono font-semibold" style={{ fontSize: 'var(--fs-body)', color: s.warn ? '#E05050' : undefined }}>
            {s.value}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsBar;
