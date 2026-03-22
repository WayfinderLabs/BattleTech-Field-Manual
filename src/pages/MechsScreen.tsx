import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { MECHS, type Mech } from "@/data/mechs";
import { useFilters } from "@/contexts/FilterContext";

const CLASS_COLORS: Record<Mech["chassisClass"], string> = {
  Light: "bg-[hsl(142,71%,45%)] text-white",
  Medium: "bg-[hsl(217,91%,60%)] text-white",
  Heavy: "bg-[hsl(24,94%,53%)] text-white",
  Assault: "bg-[hsl(0,84%,60%)] text-white",
};

type ClassFilter = Mech["chassisClass"] | "ALL";
type MetaFilter = "CLAN" | "DLC";

const CLASS_CHIPS: ClassFilter[] = ["ALL", "Light", "Medium", "Heavy", "Assault"];
const META_CHIPS: MetaFilter[] = ["CLAN", "DLC"];

const MechsScreen = () => {
  const navigate = useNavigate();
  const filters = useFilters();
  const { search, setSearch, classFilter, setClassFilter, metaFilters, toggleMeta } = filters.mechs;
  const scrollKey = "mechs";

  useEffect(() => {
    const saved = filters.scrollPositions.current[scrollKey];
    if (saved) {
      requestAnimationFrame(() => window.scrollTo(0, saved));
    }
  }, []);

  const navigateToDetail = (id: number) => {
    filters.scrollPositions.current[scrollKey] = window.scrollY;
    navigate(`/mechs/${id}`);
  };

  const filtered = useMemo(() => {
    return MECHS.filter((m) => {
      if (search && !m.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (classFilter !== "ALL" && m.chassisClass !== classFilter) return false;
      if (metaFilters.has("CLAN") && !m.isClan) return false;
      if (metaFilters.has("DLC") && m.dlcSource === "Base") return false;
      return true;
    });
  }, [search, classFilter, metaFilters]);

  return (
    <div className="py-4 space-y-4">
      <h2 className="text-primary text-heading font-mono tracking-[0.15em]">// MECH ROSTER</h2>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search mechs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-10 pl-9 pr-3 text-sm font-sans bg-card border border-border rounded-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {CLASS_CHIPS.map((chip) => (
          <button
            key={chip}
            onClick={() => setClassFilter(chip)}
            className={`shrink-0 px-3 py-1 text-xs font-mono uppercase tracking-wider rounded-sm border transition-colors active:scale-[0.97] ${
              classFilter === chip
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
            className={`shrink-0 px-3 py-1 text-xs font-mono uppercase tracking-wider rounded-sm border transition-colors active:scale-[0.97] ${
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
          <p className="text-muted-foreground text-sm font-sans italic">
            NO UNITS FOUND — REFINE SEARCH
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((m) => (
            <button
              key={m.id}
              onClick={() => navigateToDetail(m.id)}
              className="w-full text-left bg-card border border-border rounded-sm p-3 hover:border-primary/60 transition-colors active:scale-[0.98] group"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className="text-primary font-mono text-sm uppercase tracking-wider leading-tight">
                    {m.name}
                  </span>
                  <span className="text-muted-foreground font-mono text-[10px] tracking-wider ml-2">{m.variant}</span>
                </div>
                <div className="flex gap-1.5 shrink-0 flex-wrap justify-end">
                  <span className={`px-1.5 py-0.5 text-[10px] font-mono uppercase rounded-sm ${CLASS_COLORS[m.chassisClass]}`}>
                    {m.chassisClass}
                  </span>
                  {m.isClan && (
                    <span className="px-1.5 py-0.5 text-[10px] font-mono uppercase rounded-sm border border-primary text-primary">
                      CLAN
                    </span>
                  )}
                  {m.dlcSource !== "Base" && (
                    <span className="px-1.5 py-0.5 text-[10px] font-mono uppercase rounded-sm border border-border text-muted-foreground">
                      DLC
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-3">
                <div className="bg-background border border-border rounded-sm px-2 py-1 text-center min-w-[52px]">
                  <div className="text-[10px] font-mono text-muted-foreground tracking-wider">TONS</div>
                  <div className="text-sm font-mono text-foreground">{m.tonnage}T</div>
                </div>
                <div className="bg-background border border-border rounded-sm px-2 py-1 text-center min-w-[52px]">
                  <div className="text-[10px] font-mono text-muted-foreground tracking-wider">SPD</div>
                  <div className="text-sm font-mono text-foreground">{m.topSpeed} km/h</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MechsScreen;
