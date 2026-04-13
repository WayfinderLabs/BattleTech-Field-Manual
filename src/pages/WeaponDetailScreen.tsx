import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Share2 } from "lucide-react";
import { WEAPONS } from "@/data/weapons";
import { useScrollContainer } from "@/contexts/ScrollContext";
import { toast } from "sonner";

const WeaponDetailScreen = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const scrollContainer = useScrollContainer();

  useEffect(() => {
    scrollContainer.current?.scrollTo(0, 0);
  }, []);
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

  const buildShareText = () => {
    const lines: string[] = [
      weapon.name,
      `Category: ${weapon.category}`,
      `Damage: ${weapon.damage}`,
      `Stability Dmg: ${weapon.stabilityDamage}`,
      `Heat: ${weapon.heat}`,
      `Tonnage: ${weapon.tonnage}t`,
      `Critical Slots: ${weapon.criticalSlots}`,
    ];
    if (weapon.ammoPerTon !== null) {
      lines.push(`Ammo/Ton: ${weapon.ammoPerTon}`);
    }
    const formatR = (v: number) => (v === 0 ? "0m" : `${v}m`);
    lines.push(`Range — Min: ${formatR(weapon.minRange)} / Optimal: ${formatR(weapon.shortRange)} / Max: ${formatR(weapon.longRange)}`);
    lines.push(`Indirect Fire: ${weapon.indirectFire ? "Yes" : "No"}`);
    lines.push(`Clan: ${weapon.isClan ? "Yes" : "No"}`);
    lines.push(`DLC: ${weapon.dlcSource}`);
    if (weapon.notes) {
      lines.push(`Bonus: ${weapon.notes}`);
    }
    lines.push("");
    lines.push("[placeholder: App store link coming soon]");
    lines.push("");
    lines.push("— Shared via BattleTech Field Manual");
    return lines.join("\n");
  };

  const handleShare = async () => {
    const text = buildShareText();
    if (navigator.share) {
      try {
        await navigator.share({ title: weapon.name, text });
      } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(text);
        toast("Copied to clipboard — ready for sharing!", {
          style: { background: "#1a1a1a", color: "#C87941", fontFamily: "monospace", border: "1px solid #2a2a2a" },
        });
      } catch {}
    }
  };

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

  const formatRange = (val: number) => (val === 0 ? "—" : `${val}m`);

  const ranges = [
    { label: "MIN", value: formatRange(weapon.minRange) },
    { label: "OPTIMAL", value: formatRange(weapon.shortRange) },
    { label: "MAX", value: formatRange(weapon.longRange) },
  ];

  return (
    <div className="space-y-5">
      {/* Sticky header */}
      <div className="sticky top-0 z-40 -mx-4 px-4" style={{ background: "#0D0D0D", borderBottom: "1px solid #2a2a2a" }}>
        <div className="flex items-center justify-between h-11 min-h-[44px]">
          <button onClick={() => navigate("/")} className="flex items-center gap-1 text-primary text-sm font-mono active:scale-[0.97] shrink-0">
            <ChevronLeft className="h-4 w-4" /> BACK
          </button>
          <span className="text-sm font-mono uppercase tracking-widest text-foreground truncate mx-3">
            {weapon.name}
          </span>
          <button onClick={handleShare} className="shrink-0 p-1 active:scale-[0.97]" aria-label="Share">
            <Share2 className="h-5 w-5" style={{ color: "#8A8A8A" }} />
          </button>
        </div>
      </div>

      {/* Stat rows */}
      <div className="border border-border rounded-sm bg-card divide-y divide-border">
        {stats.map((s) => (
          <div key={s.label} className="flex justify-between px-4 py-2.5">
            <span className="text-label font-mono text-muted-foreground tracking-wider">{s.label}</span>
            <span className="text-detail-value font-mono text-foreground">{s.value}</span>
          </div>
        ))}
      </div>

      {/* Range table */}
      <div>
        <h2 className="text-primary text-label font-mono tracking-[0.15em] mb-2">// RANGE PROFILE</h2>
        <div className="grid grid-cols-3 border border-border rounded-sm overflow-hidden">
          {ranges.map((r) => (
            <div key={r.label} className="text-center">
              <div className="bg-primary/20 border-b border-border px-2 py-1.5">
                <span className="text-badge font-mono text-primary tracking-wider">{r.label}</span>
              </div>
              <div className="bg-card px-2 py-2.5">
                <span className="text-detail-value font-mono text-foreground">{r.value}</span>
              </div>
            </div>
          ))}
        </div>
        {weapon.indirectFire && (
          <div className="mt-2">
            <span className="inline-block px-2 py-0.5 text-badge font-mono uppercase tracking-wider rounded-sm border border-primary text-primary">
              INDIRECT FIRE ✓
            </span>
          </div>
        )}
      </div>

      {/* Notes */}
      {weapon.notes && (
        <div>
          <h2 className="text-primary text-label font-mono tracking-[0.15em] mb-2">// NOTES</h2>
          <p className="text-muted-foreground text-body font-sans italic leading-relaxed">{weapon.notes}</p>
        </div>
      )}
    </div>
  );
};

export default WeaponDetailScreen;
