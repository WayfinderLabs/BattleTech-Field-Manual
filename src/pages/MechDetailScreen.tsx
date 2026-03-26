import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { MECHS } from "@/data/mechs";
import { HP_PILL_COLORS, parseHardpointTokens } from "@/utils/hardpointPills";

const CLASS_COLORS: Record<string, string> = {
  Light: "bg-[hsl(142,71%,45%)] text-black",
  Medium: "bg-[hsl(217,91%,60%)] text-white",
  Heavy: "bg-[hsl(24,94%,53%)] text-white",
  Assault: "bg-[hsl(0,84%,60%)] text-white",
};

const HARDPOINT_LABELS = ["hd", "ct", "lt", "rt", "la", "ra", "ll", "rl"] as const;
const HARDPOINT_DISPLAY: Record<string, string> = {
  hd: "HD", ct: "CT", lt: "LT", rt: "RT", la: "LA", ra: "RA", ll: "LL", rl: "RL",
};

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const mech = MECHS.find((m) => m.id === Number(id));

  if (!mech) {
    return (
      <div className="py-4">
        <button onClick={() => navigate("/mechs")} className="flex items-center gap-1 text-primary text-body font-mono mb-4 active:scale-[0.97]">
          <ChevronLeft className="h-4 w-4" /> BACK
        </button>
        <div className="border border-border rounded-sm bg-card p-6 text-center">
          <p className="text-muted-foreground text-body italic">Mech not found.</p>
        </div>
      </div>
    );
  }

  const stats = [
    { label: "TONNAGE", value: `${mech.tonnage}T` },
    { label: "MAX ARMOR", value: mech.maxArmor },
    { label: "TOP SPEED", value: `${mech.topSpeed} km/h` },
    { label: "MAX JUMP JETS", value: mech.jumpJetsMax },
    { label: "CLAN", value: mech.isClan ? "YES" : "NO" },
    { label: "LOSTECH", value: mech.isLosTech ? "YES" : "NO" },
    { label: "DLC SOURCE", value: mech.dlcSource },
  ];

  return (
    <div className="py-4 space-y-5">
      <button onClick={() => navigate("/mechs")} className="flex items-center gap-1 text-primary text-body font-mono active:scale-[0.97]">
        <ChevronLeft className="h-4 w-4" /> BACK
      </button>

      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-primary font-mono text-heading uppercase tracking-widest leading-tight">{mech.name}</h1>
          <span className="text-muted-foreground font-mono text-label tracking-wider">{mech.variant}</span>
        </div>
        <span className={`px-2 py-0.5 text-badge font-mono uppercase rounded-sm shrink-0 ${CLASS_COLORS[mech.chassisClass]}`}>
          {mech.chassisClass}
        </span>
      </div>

      <div className="border border-border rounded-sm bg-card divide-y divide-border">
        {stats.map((s) => (
          <div key={s.label} className="flex justify-between px-4 py-2.5">
            <span className="text-label font-mono text-muted-foreground tracking-wider">{s.label}</span>
            <span className="text-detail-value font-mono text-foreground">{s.value}</span>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-primary text-label font-mono tracking-[0.15em] mb-2">// HARDPOINTS</h2>
        <div className="grid grid-cols-2 gap-px border border-border rounded-sm overflow-hidden bg-border">
          {HARDPOINT_LABELS.map((loc) => (
            <div key={loc} className="bg-card px-3 py-2.5">
              <div className="text-badge font-mono text-primary tracking-wider mb-0.5">
                {HARDPOINT_DISPLAY[loc]}
              </div>
              <div className="flex flex-wrap gap-1">
                {(() => {
                  const raw = mech.hardpoints[loc] || "—";
                  const tokens = parseHardpointTokens(raw);
                  if (tokens.length === 0) return <span className="text-detail-value font-mono text-muted-foreground">—</span>;
                  return tokens.flatMap((t, ti) =>
                    Array.from({ length: t.count }, (_, i) => (
                      <span key={`${ti}-${i}`} className={`px-1 py-0.5 font-mono rounded-sm text-[#E0E0E0] ${HP_PILL_COLORS[t.type] || ""}`} style={{ fontSize: "10px" }}>
                        {t.type}
                      </span>
                    ))
                  );
                })()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {mech.loreDescription && (
        <div>
          <h2 className="text-primary text-label font-mono tracking-[0.15em] mb-2">// LORE</h2>
          <p className="text-muted-foreground text-body font-sans italic leading-relaxed">{mech.loreDescription}</p>
        </div>
      )}
    </div>
  );
};

export default MechDetailScreen;
