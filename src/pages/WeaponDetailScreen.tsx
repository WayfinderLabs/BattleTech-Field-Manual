import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { WEAPONS } from "@/data/weapons";

const WeaponDetailScreen = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const weapon = WEAPONS.find((w) => w.id === Number(id));

  if (!weapon) {
    return (
      <div className="py-4">
        <button onClick={() => navigate("/")} className="flex items-center gap-1 text-primary text-body font-mono mb-4 active:scale-[0.97]">
          <ChevronLeft className="h-4 w-4" /> BACK
        </button>
        <div className="border border-border rounded-sm bg-card p-6 text-center">
          <p className="text-muted-foreground text-body italic">Weapon not found.</p>
        </div>
      </div>
    );
  }

  const stats = [
    { label: "CATEGORY", value: weapon.category },
    { label: "DAMAGE", value: weapon.damage },
    { label: "STABILITY DMG", value: weapon.stabilityDamage },
    { label: "HEAT", value: weapon.heat },
    { label: "TONNAGE", value: weapon.tonnage },
    { label: "CRITICAL SLOTS", value: weapon.criticalSlots },
    { label: "AMMO / TON", value: weapon.ammoPerTon ?? "N/A" },
    { label: "DLC SOURCE", value: weapon.dlcSource },
    { label: "INDIRECT FIRE", value: weapon.indirectFire ? "YES" : "NO" },
    { label: "CLAN", value: weapon.isClan ? "YES" : "NO" },
  ];

  const ranges = [
    { label: "MIN", value: weapon.minRange },
    { label: "SHORT", value: weapon.shortRange },
    { label: "MED", value: weapon.medRange },
    { label: "LONG", value: weapon.longRange },
  ];

  return (
    <div className="py-4 space-y-5">
      <button onClick={() => navigate("/")} className="flex items-center gap-1 text-primary text-body font-mono active:scale-[0.97]">
        <ChevronLeft className="h-4 w-4" /> BACK
      </button>

      <h1 className="text-primary font-mono text-xl uppercase tracking-widest leading-tight">{weapon.name}</h1>

      {/* Stat rows */}
      <div className="border border-border rounded-sm bg-card divide-y divide-border">
        {stats.map((s) => (
          <div key={s.label} className="flex justify-between px-4 py-2.5">
            <span className="text-xs font-mono text-muted-foreground tracking-wider">{s.label}</span>
            <span className="text-sm font-mono text-foreground">{s.value}</span>
          </div>
        ))}
      </div>

      {/* Range table */}
      <div>
        <h2 className="text-primary text-xs font-mono tracking-[0.15em] mb-2">// RANGE PROFILE</h2>
        <div className="grid grid-cols-4 border border-border rounded-sm overflow-hidden">
          {ranges.map((r) => (
            <div key={r.label} className="text-center">
              <div className="bg-primary/20 border-b border-border px-2 py-1.5">
                <span className="text-[10px] font-mono text-primary tracking-wider">{r.label}</span>
              </div>
              <div className="bg-card px-2 py-2.5">
                <span className="text-sm font-mono text-foreground">{r.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notes */}
      {weapon.notes && (
        <div>
          <h2 className="text-primary text-xs font-mono tracking-[0.15em] mb-2">// NOTES</h2>
          <p className="text-muted-foreground text-sm font-sans italic leading-relaxed">{weapon.notes}</p>
        </div>
      )}
    </div>
  );
};

export default WeaponDetailScreen;
