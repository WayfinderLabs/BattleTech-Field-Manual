import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { MECHS } from "@/data/mechs";

const CLASS_COLORS: Record<string, string> = {
  Light: "bg-[hsl(142,71%,45%)] text-white",
  Medium: "bg-[hsl(217,91%,60%)] text-white",
  Heavy: "bg-[hsl(24,94%,53%)] text-white",
  Assault: "bg-[hsl(0,84%,60%)] text-white",
};

const HARDPOINT_LABELS = ["hd", "ct", "lt", "rt", "la", "ra", "ll", "rl"] as const;
const HARDPOINT_DISPLAY: Record<string, string> = {
  hd: "HD", ct: "CT", lt: "LT", rt: "RT", la: "LA", ra: "RA", ll: "LL", rl: "RL",
};

const MechDetailScreen = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const mech = MECHS.find((m) => m.id === Number(id));

  if (!mech) {
    return (
      <div className="py-4">
        <button onClick={() => navigate("/mechs")} className="flex items-center gap-1 text-primary text-sm font-mono mb-4 active:scale-[0.97]">
          <ChevronLeft className="h-4 w-4" /> BACK
        </button>
        <div className="border border-border rounded-sm bg-card p-6 text-center">
          <p className="text-muted-foreground text-sm italic">Mech not found.</p>
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
    { label: "DLC SOURCE", value: mech.dlcSource },
  ];

  return (
    <div className="py-4 space-y-5">
      <button onClick={() => navigate("/mechs")} className="flex items-center gap-1 text-primary text-sm font-mono active:scale-[0.97]">
        <ChevronLeft className="h-4 w-4" /> BACK
      </button>

      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-primary font-mono text-xl uppercase tracking-widest leading-tight">{mech.name}</h1>
          <span className="text-muted-foreground font-mono text-xs tracking-wider">{mech.variant}</span>
        </div>
        <span className={`px-2 py-0.5 text-[10px] font-mono uppercase rounded-sm shrink-0 ${CLASS_COLORS[mech.chassisClass]}`}>
          {mech.chassisClass}
        </span>
      </div>

      <div className="border border-border rounded-sm bg-card divide-y divide-border">
        {stats.map((s) => (
          <div key={s.label} className="flex justify-between px-4 py-2.5">
            <span className="text-xs font-mono text-muted-foreground tracking-wider">{s.label}</span>
            <span className="text-sm font-mono text-foreground">{s.value}</span>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-primary text-xs font-mono tracking-[0.15em] mb-2">// HARDPOINTS</h2>
        <div className="grid grid-cols-2 gap-px border border-border rounded-sm overflow-hidden bg-border">
          {HARDPOINT_LABELS.map((loc) => (
            <div key={loc} className="bg-card px-3 py-2.5">
              <div className="text-[10px] font-mono text-primary tracking-wider mb-0.5">
                {HARDPOINT_DISPLAY[loc]}
              </div>
              <div className="text-sm font-mono text-foreground">
                {mech.hardpoints[loc] || "—"}
              </div>
            </div>
          ))}
        </div>
      </div>

      {mech.loreDescription && (
        <div>
          <h2 className="text-primary text-xs font-mono tracking-[0.15em] mb-2">// LORE</h2>
          <p className="text-muted-foreground text-sm font-sans italic leading-relaxed">{mech.loreDescription}</p>
        </div>
      )}
    </div>
  );
};

export default MechDetailScreen;
