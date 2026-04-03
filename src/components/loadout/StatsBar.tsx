import type { LoadoutState, LocationKey } from '@/types/loadout';
import type { HeatSink } from '@/data/loadoutEquipment';

interface StatsBarProps {
  state: LoadoutState;
  hasOverweight?: boolean;
}

const StatsBar = ({ state, hasOverweight }: StatsBarProps) => {
  const { selectedMech, slots, equipment } = state;
  if (!selectedMech) return null;

  let tonnageUsed = 0;
  let rawHeat = 0;
  let dissipation = selectedMech.baseHeatDissipation;
  const BASE_MAX_HEAT = 100;
  const OVERHEAT_LEVEL = 0.6;
  let totalMaxHeatBonus = 0;
  let jumpJetCount = 0;
  let reductionMultiplier = 1;

  const allLocations = Object.keys(slots) as LocationKey[];
  for (const loc of allLocations) {
    for (const slot of slots[loc]) {
      if (slot.weapon) {
        tonnageUsed += slot.weapon.tonnage;
        rawHeat += slot.weapon.heat;
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
          if (hs.maxHeatBonus) {
            totalMaxHeatBonus += hs.maxHeatBonus;
          }
          if (hs.heatReductionPct) {
            reductionMultiplier *= (1 - hs.heatReductionPct / 100);
          }
        }
        if (eq.item.kind === 'jumpJet') {
          jumpJetCount++;
        }
      }
    }
  }

  const adjustedHeat = Math.floor(rawHeat * reductionMultiplier);
  const threshold = Math.floor((BASE_MAX_HEAT + totalMaxHeatBonus) * OVERHEAT_LEVEL);
  const hasExchanger = reductionMultiplier < 1;
  const jjMax = selectedMech.jumpJetsMax;

  const stats = [
    { label: 'TONNAGE', value: `${tonnageUsed} / ${selectedMech.tonnage}t`, warn: hasOverweight, amber: false },
    { label: 'HEAT', value: `${adjustedHeat}`, warn: false, amber: hasExchanger },
    { label: 'DISSIPATION', value: `${dissipation}`, warn: false, amber: false },
    { label: 'THRESHOLD', value: `${threshold}`, warn: false, amber: false },
    { label: 'JUMP JETS', value: jjMax === 0 ? 'N/A' : `${jumpJetCount} / ${jjMax}`, warn: jumpJetCount > jjMax, amber: false },
  ];

  const tonnageColor = hasOverweight ? '#E05050' : undefined;
  const jjColor = jumpJetCount > jjMax ? '#E05050' : undefined;

  return (
    <div className="bg-card border border-border rounded-sm">
      {/* Row 1 — Primary stats */}
      <div className="grid grid-cols-2">
        <div className="text-center py-2 px-3 border-r border-border">
          <div className="font-mono uppercase tracking-widest" style={{ fontSize: '10px', color: '#8A8A8A' }}>
            TONNAGE
          </div>
          <div className="font-mono font-semibold text-sm" style={{ color: tonnageColor }}>
            {tonnageUsed} / {selectedMech.tonnage}t
          </div>
        </div>
        <div className="text-center py-2 px-3">
          <div className="font-mono uppercase tracking-widest" style={{ fontSize: '10px', color: '#8A8A8A' }}>
            JUMP JETS
          </div>
          <div className="font-mono font-semibold text-sm" style={{ color: jjColor }}>
            {jjMax === 0 ? 'N/A' : `${jumpJetCount} / ${jjMax}`}
          </div>
        </div>
      </div>
      {/* Row 2 — Heat stats */}
      <div className="grid grid-cols-2 border-t border-border">
        <div className="text-center py-2 px-3 border-r border-border">
          <div className="font-mono uppercase tracking-widest" style={{ fontSize: '10px', color: '#8A8A8A' }}>
            HEAT / DISSIPATION
          </div>
          <div className="font-mono font-semibold text-sm">
            <span style={{ color: hasExchanger ? '#C87941' : undefined }}>{adjustedHeat}</span>
            <span> / {dissipation}</span>
          </div>
        </div>
        <div className="text-center py-2 px-3">
          <div className="font-mono uppercase tracking-widest" style={{ fontSize: '10px', color: '#8A8A8A' }}>
            THRESHOLD
          </div>
          <div className="font-mono font-semibold text-sm">
            {threshold}
          </div>
        </div>
      </div>
      <div className="text-center py-1">
        <span className="font-mono uppercase tracking-widest" style={{ fontSize: 9, color: '#8A8A8A' }}>
          ★ SHOTS ASSUME FULL ALPHA STRIKE PER ACTIVATION
        </span>
      </div>
    </div>
  );
};

export default StatsBar;
