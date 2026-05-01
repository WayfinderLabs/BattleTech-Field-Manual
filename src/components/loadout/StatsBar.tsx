import type { LoadoutState, LocationKey } from '@/types/loadout';
import type { HeatSink } from '@/data/loadoutEquipment';
import type { Weapon } from '@/data/weapons';

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

  // Collect all equipped weapons
  const equippedWeapons: Weapon[] = [];
  for (const loc of allLocations) {
    for (const slot of slots[loc]) {
      if (slot.weapon) equippedWeapons.push(slot.weapon);
    }
  }

  // Build candidate range checkpoints from all unique shortRange and longRange values
  const checkpoints = Array.from(
    new Set(equippedWeapons.flatMap(w => [w.shortRange, w.longRange]))
  ).sort((a, b) => a - b);

  // For each checkpoint, count weapons that can fire (minRange ≤ point ≤ longRange)
  const counts = checkpoints.map(point => ({
    range: point,
    count: equippedWeapons.filter(w => w.minRange <= point && point <= w.longRange).length,
  }));

  // Find peak count
  const peakCount = counts.reduce((max, c) => Math.max(max, c.count), 0);

  // Collect all checkpoints within 1 weapon of peak
  const peakPoints = counts.filter(c => c.count >= peakCount - 1 && c.count > 0).map(c => c.range);

  // Merge into contiguous bands
  const bands: { min: number; max: number }[] = [];
  if (peakPoints.length > 0) {
    let bandStart = peakPoints[0];
    let prev = peakPoints[0];
    for (let i = 1; i < peakPoints.length; i++) {
      const curr = peakPoints[i];
      const prevIdx = checkpoints.indexOf(prev);
      const currIdx = checkpoints.indexOf(curr);
      if (currIdx === prevIdx + 1) {
        prev = curr;
      } else {
        bands.push({ min: bandStart, max: prev });
        bandStart = curr;
        prev = curr;
      }
    }
    bands.push({ min: bandStart, max: prev });
  }

  const optimumRangeStr = equippedWeapons.length === 0
    ? '—'
    : bands.map(b => b.min === b.max ? `${b.min}m` : `${b.min} – ${b.max}m`).join(' / ');

  const adjustedHeat = Math.floor(rawHeat * reductionMultiplier);
  const shutdown = BASE_MAX_HEAT + totalMaxHeatBonus;
  const hasExchanger = reductionMultiplier < 1;
  const jjMax = selectedMech.jumpJetsMax;

  const availableTonnage = selectedMech.tonnage - selectedMech.initialTonnage;

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
        {/* Row 3 — Optimum range */}
        <div className="text-center py-2 px-3 border-t border-border">
          <div className="font-mono uppercase tracking-widest" style={{ fontSize: '10px', color: '#8A8A8A' }}>
            OPTIMUM RANGE ({peakCount} WEAPONS)
          </div>
          <div className="font-mono font-semibold text-sm" style={{ color: peakCount > 0 ? '#C87941' : '#8A8A8A' }}>
            {optimumRangeStr}
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
