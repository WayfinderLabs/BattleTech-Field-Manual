import { createContext, useContext, useRef, useState, type ReactNode, type MutableRefObject } from "react";
import type { Weapon } from "@/data/weapons";
import type { Mech } from "@/data/mechs";

type WeaponCategoryFilter = Weapon["category"] | "ALL";
type MechClassFilter = Mech["chassisClass"] | "ALL";
type MetaFilter = "CLAN" | "DLC";

interface WeaponsFilterState {
  search: string;
  setSearch: (v: string) => void;
  categoryFilter: WeaponCategoryFilter;
  setCategoryFilter: (v: WeaponCategoryFilter) => void;
  metaFilters: Set<MetaFilter>;
  toggleMeta: (m: MetaFilter) => void;
}

interface MechsFilterState {
  search: string;
  setSearch: (v: string) => void;
  classFilter: MechClassFilter;
  setClassFilter: (v: MechClassFilter) => void;
  metaFilters: Set<MetaFilter>;
  toggleMeta: (m: MetaFilter) => void;
}

interface FilterContextType {
  weapons: WeaponsFilterState;
  mechs: MechsFilterState;
}

const FilterContext = createContext<FilterContextType | null>(null);

export const useFilters = () => {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error("useFilters must be used within FilterProvider");
  return ctx;
};

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  // Weapons state
  const [wSearch, setWSearch] = useState("");
  const [wCategory, setWCategory] = useState<WeaponCategoryFilter>("ALL");
  const [wMeta, setWMeta] = useState<Set<MetaFilter>>(new Set());

  const toggleWMeta = (m: MetaFilter) => {
    setWMeta((prev) => {
      const next = new Set(prev);
      next.has(m) ? next.delete(m) : next.add(m);
      return next;
    });
  };

  // Mechs state
  const [mSearch, setMSearch] = useState("");
  const [mClass, setMClass] = useState<MechClassFilter>("ALL");
  const [mMeta, setMMeta] = useState<Set<MetaFilter>>(new Set());

  const toggleMMeta = (m: MetaFilter) => {
    setMMeta((prev) => {
      const next = new Set(prev);
      next.has(m) ? next.delete(m) : next.add(m);
      return next;
    });
  };

  return (
    <FilterContext.Provider
      value={{
        weapons: {
          search: wSearch,
          setSearch: setWSearch,
          categoryFilter: wCategory,
          setCategoryFilter: setWCategory,
          metaFilters: wMeta,
          toggleMeta: toggleWMeta,
        },
        mechs: {
          search: mSearch,
          setSearch: setMSearch,
          classFilter: mClass,
          setClassFilter: setMClass,
          metaFilters: mMeta,
          toggleMeta: toggleMMeta,
        },
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};
