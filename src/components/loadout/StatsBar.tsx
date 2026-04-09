import type { LoadoutState, LocationKey } from '@/types/loadout';
import type { HeatSink } from '@/data/loadoutEquipment';

interface StatsBarProps {
  state: LoadoutState;
  armorPoints?: number;
}

const StatsBar = ({ state, armorPoints = 0 }: StatsBarProps) => {
  const { selectedMech, slots, equipment } = state;
  if (!selectedMech) return null;

  let tonnageUsed = armorPoints * 0.0125;
  let rawHeat = 0;
  let dissipation = selectedMech.baseHeatDissipation;
  const BASE_MAX_HEAT = 100;
  
  let totalMaxHeatBonus = 0;
  let jumpJetCount = 0;
  let reductionMultiplier = 1;
  let totalDamage = 0;

  const allLocations = Object.keys(slots) as LocationKey[];
  for (const loc of allLocations) {
    for (const slot of slots[loc]) {
      if (slot.weapon) {
        tonnageUsed += slot.weapon.tonnage;
        rawHeat += slot.weapon.heat;
        totalDamage += slot.weapon.damage;
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
  const shutdown = BASE_MAX_HEAT + totalMaxHeatBonus;
  const hasExchanger = reductionMultiplier < 1;
  const jjMax = selectedMech.jumpJetsMax;

  const availableTonnage = selectedMech.tonnage - selectedMech.initialTonnage;

  // Tonnage color states — derived directly from computed values each render
  const tonnageColor = tonnageUsed > availableTonnage
    ? '#FF4444'
    : tonnageUsed < availableTonnage
      ? '#FFD700'
      : '#FFFFFF';

  const jjColor = jumpJetCount > jjMax ? '#E05050' : undefined;

  return (
    <div>
      <div className="bg-card border border-border rounded-sm">
        {/* Row 1 — Primary stats: 3 columns */}
        <div className="grid grid-cols-3">
          <div className="text-center py-2 px-3 border-r border-border">
            <div className="font-mono uppercase tracking-widest" style={{ fontSize: '10px', color: tonnageColor }}>
              TONNAGE
            </div>
            <div className="font-mono font-semibold text-sm" style={{ color: tonnageColor }}>
              {tonnageUsed} / {availableTonnage}t
            </div>
          </div>
          <div className="text-center py-2 px-3 border-r border-border">
            <div className="font-mono uppercase tracking-widest" style={{ fontSize: '10px', color: '#8A8A8A' }}>
              DAMAGE OUTPUT
            </div>
            <div className="font-mono font-semibold text-sm" style={{ color: '#C87941' }}>
              {Math.floor(totalDamage)}
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
              SHUTDOWN
            </div>
            <div className="font-mono font-semibold text-sm">
              {shutdown}
            </div>
          </div>
        </div>
      </div>
      {/* Heat disclaimer */}
      <div className="font-mono mt-1" style={{ fontSize: '10px', color: '#8A8A8A' }}>
        * HEAT FROM JUMP JETS NOT INCLUDED
      </div>
    </div>
  );
};

export default StatsBar;
