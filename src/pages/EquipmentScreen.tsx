import { useMemo } from "react";
import { Search } from "lucide-react";
import { EQUIPMENT, type Equipment } from "@/data/equipment";
import { useFilters } from "@/contexts/FilterContext";
import { NativeAdCard } from "@/components/NativeAdCard";
import { useNativeAd } from "@/hooks/useNativeAd";

const CATEGORY_COLORS: Record<Equipment["category"], string> = {
  "Heat Sink": "bg-[hsl(0,84%,60%)] text-white",
  "Jump Jet": "bg-[hsl(142,71%,45%)] text-white",
  Sensor: "bg-[hsl(217,91%,60%)] text-white",
  Gyro: "bg-[hsl(280,60%,50%)] text-white",
  Cockpit: "bg-[hsl(340,65%,50%)] text-white",
  Actuator: "bg-[hsl(24,94%,53%)] text-white",
  Other: "bg-[hsl(220,9%,46%)] text-white",
};

const SECTION_ORDER: Equipment["category"][] = [
  "Heat Sink",
  "Jump Jet",
  "Sensor",
  "Gyro",
  "Cockpit",
  "Actuator",
  "Other",
];

const SECTION_LABELS: Record<Equipment["category"], string> = {
  "Heat Sink": "HEAT SINKS",
  "Jump Jet": "JUMP JETS",
  Sensor: "SENSORS",
  Gyro: "GYROS",
  Cockpit: "COCKPITS",
  Actuator: "ACTUATORS",
  Other: "OTHER",
};

const CATEGORY_CHIPS: (Equipment["category"] | "ALL")[] = [
  "ALL", "Heat Sink", "Jump Jet", "Sensor", "Gyro", "Cockpit",
  "Actuator", "Other",
];
const META_CHIPS = ["DLC"] as const;

const EquipmentCard = ({ eq }: { eq: Equipment }) => (
  <div
    key={eq.id}
    className="bg-card border border-border rounded-sm p-3"
  >
    <div className="flex items-start justify-between gap-2 mb-1.5">
      <span className="text-primary font-mono text-card-title uppercase tracking-wider leading-tight">
        {eq.name}
      </span>
      <div className="flex gap-1.5 shrink-0">
        <span className={`px-1.5 py-0.5 text-badge font-mono uppercase rounded-sm ${CATEGORY_COLORS[eq.category]}`}>
          {eq.category}
        </span>
        {eq.isClan && (
          <span className="px-1.5 py-0.5 text-badge font-mono uppercase rounded-sm border border-primary text-primary">
            CLAN
          </span>
        )}
        {eq.dlcSource !== "Base" && (
          <span className="px-1.5 py-0.5 text-badge font-mono uppercase rounded-sm border border-border text-muted-foreground">
            DLC
          </span>
        )}
      </div>
    </div>
    <p className="text-muted-foreground text-sm font-mono leading-relaxed mb-2">
      {eq.effectDescription}
    </p>
    <div className="flex gap-3">
      <div className="bg-background border border-border rounded-sm px-2 py-1 text-center min-w-[52px]">
        <div className="text-label font-mono text-muted-foreground tracking-wider">TONS</div>
        <div className="text-detail-value font-mono text-foreground">{eq.tonnage}</div>
      </div>
      <div className="bg-background border border-border rounded-sm px-2 py-1 text-center min-w-[52px]">
        <div className="text-label font-mono text-muted-foreground tracking-wider">SLOTS</div>
        <div className="text-detail-value font-mono text-foreground">{eq.criticalSlots}</div>
      </div>
    </div>
  </div>
);

const EquipmentScreen = () => {
  const { adAssets } = useNativeAd();
  const { search, setSearch, categoryFilter, setCategoryFilter, metaFilters, toggleMeta } = useFilters().equipment;

  const filtered = useMemo(() => {
    return EQUIPMENT.filter((e) => {
      if (search && !e.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (categoryFilter !== "ALL" && e.category !== categoryFilter) return false;
      if (metaFilters.has("DLC") && e.dlcSource === "Base") return false;
      return true;
    });
  }, [search, categoryFilter, metaFilters]);

  const grouped = useMemo(() => {
    const map = new Map<Equipment["category"], Equipment[]>();
    for (const cat of SECTION_ORDER) {
      const items = filtered.filter((e) => e.category === cat);
      if (items.length > 0) map.set(cat, items);
    }
    return map;
  }, [filtered]);

  return (
    <div className="py-4 space-y-4">
      <h2 className="text-primary text-heading font-mono tracking-[0.15em]">// EQUIPMENT REFERENCE</h2>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search equipment..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-10 pl-9 pr-3 text-body font-sans bg-card border border-border rounded-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {CATEGORY_CHIPS.map((chip) => (
          <button
            key={chip}
            onClick={() => setCategoryFilter(categoryFilter === chip ? "ALL" : chip)}
            className={`shrink-0 px-3 py-1 text-label font-mono uppercase tracking-wider rounded-sm border transition-colors active:scale-[0.97] ${
              categoryFilter === chip
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground border-border hover:border-primary/50"
            }`}
          >
            {chip}
          </button>
        ))}
        {META_CHIPS.map((chip) => (
          <button
            key={chip}
            onClick={() => toggleMeta(chip)}
            className={`shrink-0 px-3 py-1 text-label font-mono uppercase tracking-wider rounded-sm border transition-colors active:scale-[0.97] ${
              metaFilters.has(chip)
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground border-border hover:border-primary/50"
            }`}
          >
            {chip}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="border border-border rounded-sm bg-card p-10 flex items-center justify-center">
          <p className="text-muted-foreground text-body font-sans italic">
            NO UNITS FOUND — REFINE SEARCH
          </p>
        </div>
      ) : categoryFilter === "ALL" ? (
        SECTION_ORDER.map((cat) => {
          const items = grouped.get(cat);
          if (!items) return null;
          return (
            <div key={cat}>
              <div className="sticky top-0 z-10 bg-background py-2">
                <div className="border-l-2 border-primary pl-3">
                  <span className="text-label font-mono text-muted-foreground uppercase tracking-wider">
                    // {SECTION_LABELS[cat]}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                {items.map((eq) => (
                  <EquipmentCard key={eq.id} eq={eq} />
                ))}
              </div>
              {cat === "Heat Sink" && adAssets && (
                <NativeAdCard assets={adAssets} key="native-ad-equipment-heatsink" />
              )}
            </div>
          );
        })
      ) : (
        <div className="space-y-2">
          {filtered.map((eq) => (
            <EquipmentCard key={eq.id} eq={eq} />
          ))}
        </div>
      )}
    </div>
  );
};

export default EquipmentScreen;
