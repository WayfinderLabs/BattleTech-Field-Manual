import { createContext, useContext, useRef, useState, type ReactNode, type MutableRefObject } from "react";
import type { Weapon } from "@/data/weapons";
import type { Mech } from "@/data/mechs";
import type { Equipment } from "@/data/equipment";
import type { DlcMode } from "@/lib/dlcFilter";

type WeaponCategoryFilter = Weapon["category"] | "ALL";
type MechClassFilter = Mech["chassisClass"] | "ALL";
type EquipmentCategoryFilter = Equipment["category"] | "ALL";
type MetaFilter = "CLAN" | "DLC" | "LOSTECH";

interface WeaponsFilterState {
  search: string;
  setSearch: (v: string) => void;
  categoryFilter: WeaponCategoryFilter;
  setCategoryFilter: (v: WeaponCategoryFilter) => void;
  metaFilters: Set<MetaFilter>;
  toggleMeta: (m: MetaFilter) => void;
  dlcMode: DlcMode;
  setDlcMode: (m: DlcMode) => void;
}

interface MechsFilterState {
  search: string;
  setSearch: (v: string) => void;
  classFilter: MechClassFilter;
  setClassFilter: (v: MechClassFilter) => void;
  metaFilters: Set<MetaFilter>;
  toggleMeta: (m: MetaFilter) => void;
  dlcMode: DlcMode;
  setDlcMode: (m: DlcMode) => void;
}

interface EquipmentFilterState {
  search: string;
  setSearch: (v: string) => void;
  categoryFilter: EquipmentCategoryFilter;
  setCategoryFilter: (v: EquipmentCategoryFilter) => void;
  metaFilters: Set<MetaFilter>;
  toggleMeta: (m: MetaFilter) => void;
  dlcMode: DlcMode;
  setDlcMode: (m: DlcMode) => void;
}

interface FilterContextType {
  weapons: WeaponsFilterState;
  mechs: MechsFilterState;
  equipment: EquipmentFilterState;
  /** Shared by the loadout builder mech and item pickers */
  builder: { dlcMode: DlcMode; setDlcMode: (m: DlcMode) => void };
  scrollPositions: MutableRefObject<Record<string, number>>;
}

const FilterContext = createContext<FilterContextType | null>(null);

export const useFilters = () => {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error("useFilters must be used within FilterProvider");
  return ctx;
};

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const scrollPositions = useRef<Record<string, number>>({});
  // Weapons state
  const [wSearch, setWSearch] = useState("");
  const [wCategory, setWCategory] = useState<WeaponCategoryFilter>("ALL");
  const [wMeta, setWMeta] = useState<Set<MetaFilter>>(new Set());
  const [wDlc, setWDlc] = useState<DlcMode>("ALL");

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
  const [mDlc, setMDlc] = useState<DlcMode>("ALL");

  const toggleMMeta = (m: MetaFilter) => {
    setMMeta((prev) => {
      const next = new Set(prev);
      next.has(m) ? next.delete(m) : next.add(m);
      return next;
    });
  };

  // Equipment state
  const [eSearch, setESearch] = useState("");
  const [eCategory, setECategory] = useState<EquipmentCategoryFilter>("ALL");
  const [eMeta, setEMeta] = useState<Set<MetaFilter>>(new Set());
  const [eDlc, setEDlc] = useState<DlcMode>("ALL");
  const [bDlc, setBDlc] = useState<DlcMode>("ALL");

  const toggleEMeta = (m: MetaFilter) => {
    setEMeta((prev) => {
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
          dlcMode: wDlc,
          setDlcMode: setWDlc,
        },
        mechs: {
          search: mSearch,
          setSearch: setMSearch,
          classFilter: mClass,
          setClassFilter: setMClass,
          metaFilters: mMeta,
          toggleMeta: toggleMMeta,
          dlcMode: mDlc,
          setDlcMode: setMDlc,
        },
        equipment: {
          search: eSearch,
          setSearch: setESearch,
          categoryFilter: eCategory,
          setCategoryFilter: setECategory,
          metaFilters: eMeta,
          toggleMeta: toggleEMeta,
          dlcMode: eDlc,
          setDlcMode: setEDlc,
        },
        builder: { dlcMode: bDlc, setDlcMode: setBDlc },
        scrollPositions,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};
