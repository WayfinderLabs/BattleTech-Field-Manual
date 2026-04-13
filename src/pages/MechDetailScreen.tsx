import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Share2 } from "lucide-react";
import { MECHS } from "@/data/mechs";
import { HP_PILL_COLORS, parseHardpointTokens } from "@/utils/hardpointPills";
import { useScrollContainer } from "@/contexts/ScrollContext";
import { toast } from "sonner";

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

const HP_TYPE_FULL: Record<string, string> = {
  B: "Ballistic", E: "Energy", M: "Missile", S: "Support",
};

const MechDetailScreen = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const scrollContainer = useScrollContainer();

  useEffect(() => {
    scrollContainer.current?.scrollTo(0, 0);
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

  const formatHardpointLine = (raw: string): string => {
    if (!raw || raw === "—") return "—";
    const tokens = parseHardpointTokens(raw);
    if (tokens.length === 0) return "—";
    const expanded: string[] = [];
    for (const t of tokens) {
      const fullName = HP_TYPE_FULL[t.type] || t.type;
      for (let i = 0; i < t.count; i++) expanded.push(fullName);
    }
    return expanded.join(", ");
  };

  const buildShareText = () => {
    const lines: string[] = [
      `${mech.name} (${mech.variant})`,
      `Class: ${mech.chassisClass}`,
      `Tonnage: ${mech.tonnage}T`,
      `Max Armor: ${mech.maxArmor}`,
      `Top Speed: ${mech.topSpeed} km/h`,
      `Max Jump Jets: ${mech.jumpJetsMax}`,
      `Clan: ${mech.isClan ? "Yes" : "No"}`,
      `LosTech: ${mech.isLosTech ? "Yes" : "No"}`,
      `DLC: ${mech.dlcSource}`,
      "",
      "Hardpoints:",
    ];
    for (const loc of HARDPOINT_LABELS) {
      lines.push(`${HARDPOINT_DISPLAY[loc]}: ${formatHardpointLine(mech.hardpoints[loc])}`);
    }
    lines.push("");
    lines.push("[placeholder: App store link coming soon]");
    lines.push("");
    lines.push("— Shared via BattleTech Field Manual");
    return lines.join("\n");
  };

  const shareTitle = `${mech.name} ${mech.variant}`;

  const handleShare = async () => {
    const text = buildShareText();
    if (navigator.share) {
      try {
        await navigator.share({ title: shareTitle, text });
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
    { label: "TONNAGE", value: `${mech.tonnage}T` },
    { label: "MAX ARMOR", value: mech.maxArmor },
    { label: "TOP SPEED", value: `${mech.topSpeed} km/h` },
    { label: "MAX JUMP JETS", value: mech.jumpJetsMax },
    { label: "CLAN", value: mech.isClan ? "YES" : "NO" },
    { label: "LOSTECH", value: mech.isLosTech ? "YES" : "NO" },
    { label: "DLC SOURCE", value: mech.dlcSource },
  ];

  return (
    <div className="space-y-5">
      {/* Sticky header */}
      <div className="sticky top-0 z-40 -mx-4 px-4" style={{ background: "#0D0D0D", borderBottom: "1px solid #2a2a2a" }}>
        <div className="flex items-center justify-between h-11 min-h-[44px]">
          <button onClick={() => navigate("/mechs")} className="flex items-center gap-1 text-primary text-sm font-mono active:scale-[0.97] shrink-0">
            <ChevronLeft className="h-4 w-4" /> BACK
          </button>
          <span className="text-sm font-mono uppercase tracking-widest truncate mx-3">
            <span className="text-foreground">{mech.name}</span>
            {" "}
            <span style={{ color: "#8A8A8A" }}>{mech.variant}</span>
          </span>
          <button onClick={handleShare} className="shrink-0 p-1 active:scale-[0.97]" aria-label="Share">
            <Share2 className="h-5 w-5" style={{ color: "#8A8A8A" }} />
          </button>
        </div>
      </div>

      {/* Class badge */}
      <div>
        <span className={`px-2 py-0.5 text-badge font-mono uppercase rounded-sm ${CLASS_COLORS[mech.chassisClass]}`}>
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
