import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { WEAPONS, type Weapon } from "@/data/weapons";
import { useFilters } from "@/contexts/FilterContext";
import { useScrollContainer } from "@/contexts/ScrollContext";

const CATEGORY_COLORS: Record<Weapon["category"], string> = {
  Ballistic: "bg-[hsl(220,9%,46%)] text-white",
  Energy: "bg-[hsl(217,91%,60%)] text-white",
  Missile: "bg-[hsl(142,71%,45%)] text-black",
  Support: "bg-[hsl(48,96%,53%)] text-black",
};

type CategoryFilter = Weapon["category"] | "ALL";
type MetaFilter = "CLAN" | "DLC";

const isTierVariant = (name: string) => name.includes('+');

const CATEGORY_CHIPS: CategoryFilter[] = ["ALL", "Ballistic", "Energy", "Missile", "Support"];
const META_CHIPS: MetaFilter[] = ["CLAN", "DLC"];


const WeaponsScreen = () => {
  const navigate = useNavigate();
  const filters = useFilters();
  const scrollContainer = useScrollContainer();
  const { search, setSearch, categoryFilter, setCategoryFilter, metaFilters, toggleMeta } = filters.weapons;
  const [tierFilter, setTierFilter] = useState(false);
  const scrollKey = "weapons";

  useEffect(() => {
    const saved = filters.scrollPositions.current[scrollKey];
    if (saved) {
      requestAnimationFrame(() => scrollContainer.current?.scrollTo(0, saved));
    }
  }, []);

  const navigateToDetail = (id: number) => {
    filters.scrollPositions.current[scrollKey] = scrollContainer.current?.scrollTop ?? 0;
    navigate(`/weapons/${id}`);
  };

  const filtered = useMemo(() => {
    const WEAPON_ORDER: Record<string, number> = {
      // ── BALLISTIC ──────────────────────────────────────
      'Ballistic:AC/2':          100,
      'Ballistic:AC/5':          110,
      'Ballistic:AC/10':         120,
      'Ballistic:AC/20':         130,
      'Ballistic:Gauss Rifle':   140,
      // ── ENERGY ─────────────────────────────────────────
      'Energy:Small Laser':         200,
      'Energy:Medium Laser':        210,
      'Energy:Large Laser':         220,
      'Energy:ER Small Laser':      230,
      'Energy:ER Medium Laser':     240,
      'Energy:ER Large Laser':      250,
      'Energy:Small Pulse Laser':   260,
      'Energy:Medium Pulse Laser':  270,
      'Energy:Large Pulse Laser':   280,
      'Energy:PPC':                 290,
      'Energy:ER PPC':              300,
      'Energy:Flamer':              310,
      // ── MISSILE ────────────────────────────────────────
      'Missile:SRM 2':    400,
      'Missile:SRM 4':    410,
      'Missile:SRM 6':    420,
      'Missile:LRM 5':    430,
      'Missile:LRM 10':   440,
      'Missile:LRM 15':   450,
      'Missile:LRM 20':   460,
      // ── SUPPORT ────────────────────────────────────────
      'Support:Small Laser':       500,
      'Support:ER Small Laser':    510,
      'Support:Small Pulse Laser': 520,
      'Support:Machine Gun':       530,
      'Support:Flamer':            540,
    };

    const stripTier = (name: string) =>
      name.replace(/\s*(\+\s*)+$/, '').trim();

    const getTier = (name: string) => {
      const match = name.match(/(\+[\s+]*)+$/);
      if (!match) return 0;
      return (match[0].match(/\+/g) || []).length;
    };

    const getSortKey = (w: Weapon): number => {
      const base = stripTier(w.name);
      return WEAPON_ORDER[`${w.category}:${base}`] ?? 999;
    };

    return WEAPONS.filter((w) => {
      if (search && !w.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (categoryFilter !== "ALL" && w.category !== categoryFilter) return false;
      if (tierFilter ? !isTierVariant(w.name) : isTierVariant(w.name)) return false;
      if (metaFilters.has("CLAN") && !w.isClan) return false;
      if (metaFilters.has("DLC") && w.dlcSource === "Base") return false;
      return true;
    }).sort((a, b) => {
      const keyA = getSortKey(a);
      const keyB = getSortKey(b);
      if (keyA !== keyB) return keyA - keyB;
      const tierA = getTier(a.name);
      const tierB = getTier(b.name);
      if (tierA !== tierB) return tierA - tierB;
      return a.name.localeCompare(b.name);
    });
  }, [search, categoryFilter, tierFilter, metaFilters]);

  return (
    <div className="py-4 space-y-4">
      <h2 className="text-primary text-heading font-mono tracking-[0.15em]">// WEAPONS DATABASE</h2>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search weapons..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-10 pl-9 pr-3 text-body font-sans bg-card border border-border rounded-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {CATEGORY_CHIPS.map((chip) => (
          <button
            key={chip}
            onClick={() => setCategoryFilter(categoryFilter === chip ? 'ALL' : chip)}
            className={`shrink-0 px-3 py-1 text-label font-mono uppercase tracking-wider rounded-sm border transition-colors active:scale-[0.97] ${
              categoryFilter === chip
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground border-border hover:border-primary/50"
            }`}
          >
            {chip}
          </button>
        ))}
        <button
          onClick={() => setTierFilter(!tierFilter)}
          className={`shrink-0 px-3 py-1 text-label font-mono uppercase tracking-wider rounded-sm border transition-colors active:scale-[0.97] ${
            tierFilter
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-card text-muted-foreground border-border hover:border-primary/50"
          }`}
        >
          TIER
        </button>
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
      ) : (
        <div className="space-y-2">
          {filtered.map((w) => (
            <button
              key={w.id}
              onClick={() => navigateToDetail(w.id)}
              className="w-full text-left bg-card border border-border rounded-sm p-3 hover:border-primary/60 transition-colors active:scale-[0.98] group"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-primary font-mono text-card-title uppercase tracking-wider leading-tight">
                  {w.name}
                </span>
                <div className="flex gap-1.5 shrink-0 flex-wrap justify-end">
                  <span className={`px-1.5 py-0.5 text-badge font-mono uppercase rounded-sm ${CATEGORY_COLORS[w.category]}`}>
                    {w.category}
                  </span>
                  {w.isClan && (
                    <span className="px-1.5 py-0.5 text-badge font-mono uppercase rounded-sm border border-primary text-primary">
                      CLAN
                    </span>
                  )}
                  {w.dlcSource !== "Base" && (
                    <span className="px-1.5 py-0.5 text-badge font-mono uppercase rounded-sm border border-border text-muted-foreground">
                      DLC
                    </span>
                  )}
                </div>
              </div>
              {w.notes && (
                <p className="font-mono text-xs mb-2" style={{ color: '#8A8A8A' }}>{w.notes}</p>
              )}
              <div className="flex gap-3">
                {[
                  { label: "DMG", value: w.damage },
                  { label: "HEAT", value: w.heat },
                  { label: "TONS", value: w.tonnage },
                ].map((stat) => (
                  <div key={stat.label} className="bg-background border border-border rounded-sm px-2 py-1 text-center min-w-[52px]">
                    <div className="text-label font-mono text-muted-foreground tracking-wider">{stat.label}</div>
                    <div className="text-detail-value font-mono text-foreground">{stat.value}</div>
                  </div>
                ))}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default WeaponsScreen;
