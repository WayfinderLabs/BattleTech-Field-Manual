import { useState, useMemo, useRef } from 'react';
import { WEAPONS, type Weapon } from '@/data/weapons';
import { AMMO_BINS, HEAT_SINKS, JUMP_JETS, type AmmoBin, type HeatSink, type JumpJet } from '@/data/loadoutEquipment';
import type { Mech } from '@/data/mechs';
import type { SlotAssignment, HardpointType, LocationKey, SlotItem, EquipmentSlot } from '@/types/loadout';
import { LOCATION_LABELS } from '@/types/loadout';
import { HP_PILL_COLORS } from '@/utils/hardpointPills';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';

type CategoryFilter = Weapon['category'] | 'ALL';
type PickerTab = 'WEAPONS' | 'AMMO' | 'HEAT SINKS' | 'JUMP JETS';

const CATEGORY_COLORS: Record<Weapon['category'], string> = {
  Ballistic: 'bg-[hsl(220,9%,46%)] text-white',
  Energy: 'bg-[hsl(217,91%,60%)] text-white',
  Missile: 'bg-[hsl(142,71%,45%)] text-black',
  Support: 'bg-[hsl(48,96%,53%)] text-black',
};

const HP_TO_CATEGORY: Record<HardpointType, Weapon['category']> = {
  B: 'Ballistic', E: 'Energy', M: 'Missile', S: 'Support',
};

const CATEGORY_TO_HP: Record<Weapon['category'], HardpointType> = {
  Ballistic: 'B', Energy: 'E', Missile: 'M', Support: 'S',
};

const TABS: PickerTab[] = ['WEAPONS', 'AMMO', 'HEAT SINKS', 'JUMP JETS'];

const JJ_ALLOWED_LOCATIONS: LocationKey[] = ['ct', 'lt', 'rt', 'll', 'rl'];

interface UnifiedWeaponPickerProps {
  open: boolean;
  locationKey: LocationKey;
  slots: SlotAssignment[];
  equipment: EquipmentSlot[];
  inventorySlots: number;
  mech: Mech;
  allEquipment: Record<LocationKey, EquipmentSlot[]>;
  onClose: () => void;
  onAddWeapon: (weapon: Weapon, slotIndex: number) => void;
  onAddEquipment: (item: SlotItem) => void;
}

const UnifiedWeaponPicker = ({
  open, locationKey, slots, equipment, inventorySlots, mech, allEquipment,
  onClose, onAddWeapon, onAddEquipment,
}: UnifiedWeaponPickerProps) => {
  const [tab, setTab] = useState<PickerTab>('WEAPONS');
  const [filter, setFilter] = useState<CategoryFilter>('ALL');
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState(false);
  const [flashId, setFlashId] = useState<string | number | null>(null);

  // Compute used inventory slots
  const usedInventorySlots = useMemo(() => {
    const weaponSlots = slots.reduce((sum, s) => sum + (s.weapon ? s.weapon.criticalSlots : 0), 0);
    const equipSlots = equipment.reduce((sum, eq) => sum + eq.slotsUsed, 0);
    return weaponSlots + equipSlots;
  }, [slots, equipment]);

  const remainingInventory = inventorySlots - usedInventorySlots;

  // Remaining weapon hardpoint slots
  const remaining = useMemo(() => {
    const counts: Partial<Record<HardpointType, number>> = {};
    for (const slot of slots) {
      if (!slot.weapon) {
        counts[slot.hardpointType] = (counts[slot.hardpointType] || 0) + 1;
      }
    }
    return counts;
  }, [slots]);

  const allCategories = useMemo(() => {
    const types = new Set<HardpointType>();
    for (const slot of slots) types.add(slot.hardpointType);
    return Array.from(types);
  }, [slots]);

  const remainingPills = useMemo(() => {
    const pills: HardpointType[] = [];
    for (const slot of slots) {
      if (!slot.weapon) pills.push(slot.hardpointType);
    }
    return pills;
  }, [slots]);

  const availableCategories = useMemo(() => {
    return new Set(Object.entries(remaining).filter(([, c]) => c! > 0).map(([t]) => HP_TO_CATEGORY[t as HardpointType]));
  }, [remaining]);

  const chips = useMemo(() => {
    const cats: CategoryFilter[] = ['ALL'];
    for (const hp of allCategories) {
      cats.push(HP_TO_CATEGORY[hp]);
    }
    return cats;
  }, [allCategories]);

  // Filtered & sorted weapons
  const isTierVariant = (name: string) => name.includes('+');

  const filteredWeapons = useMemo(() => {
    const WEAPON_ORDER: Record<string, number> = {
      'AC/2':          100,
      'AC/5':          110,
      'AC/10':         120,
      'AC/20':         130,
      'Gauss Rifle':   140,
      'Small Laser':         200,
      'Medium Laser':        210,
      'Large Laser':         220,
      'ER Small Laser':      230,
      'ER Medium Laser':     240,
      'ER Large Laser':      250,
      'Small Pulse Laser':   260,
      'Medium Pulse Laser':  270,
      'Large Pulse Laser':   280,
      'PPC':                 290,
      'ER PPC':              300,
      'Flamer':              310,
      'SRM 2':    400,
      'SRM 4':    410,
      'SRM 6':    420,
      'LRM 5':    430,
      'LRM 10':   440,
      'LRM 15':   450,
      'LRM 20':   460,
      'Small Laser':       500,
      'ER Small Laser':    510,
      'Small Pulse Laser': 520,
      'Machine Gun':       530,
      'Flamer':            540,
    };
    const stripTier = (name: string) => name.replace(/\s*(\+\s*)+$/, '').trim();
    const getTier = (name: string) => {
      const m = name.match(/(\+[\s+]*)+$/);
      if (!m) return 0;
      return (m[0].match(/\+/g) || []).length;
    };
    const getSortKey = (w: Weapon): number => {
      const base = stripTier(w.name);
      return WEAPON_ORDER[base] ?? 999;
    };
    return WEAPONS.filter((w) => {
      if (!availableCategories.has(w.category)) return false;
      if (filter !== 'ALL' && w.category !== filter) return false;
      if (tierFilter ? !isTierVariant(w.name) : isTierVariant(w.name)) return false;
      if (search && !w.name.toLowerCase().includes(search.toLowerCase())) return false;
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
  }, [filter, search, tierFilter, availableCategories]);

  // Jump jet availability
  const jjAllowed = JJ_ALLOWED_LOCATIONS.includes(locationKey);
  const totalJJCount = useMemo(() => {
    let count = 0;
    for (const loc of Object.keys(allEquipment) as LocationKey[]) {
      for (const eq of allEquipment[loc]) {
        if (eq.item?.kind === 'jumpJet') count++;
      }
    }
    return count;
  }, [allEquipment]);
  const jjMaxReached = totalJJCount >= mech.jumpJetsMax;

  // Compatible jump jets for this mech's tonnage
  const compatibleJJ = useMemo(() => {
    return JUMP_JETS.filter(jj => mech.tonnage >= jj.minTonnage && mech.tonnage <= jj.maxTonnage);
  }, [mech.tonnage]);

  // Filtered ammo
  const filteredAmmo = useMemo(() => {
    if (search) return AMMO_BINS.filter(a => a.name.toLowerCase().includes(search.toLowerCase()));
    return AMMO_BINS;
  }, [search]);

  // Filtered heat sinks
  const filteredHS = useMemo(() => {
    if (search) return HEAT_SINKS.filter(h => h.name.toLowerCase().includes(search.toLowerCase()));
    return HEAT_SINKS;
  }, [search]);

  // Filtered jump jets
  const filteredJJ = useMemo(() => {
    if (!jjAllowed) return [];
    let jjs = compatibleJJ;
    if (search) jjs = jjs.filter(j => j.name.toLowerCase().includes(search.toLowerCase()));
    return jjs;
  }, [search, jjAllowed, compatibleJJ]);

  const handleAddWeapon = (weapon: Weapon) => {
    const hpType = CATEGORY_TO_HP[weapon.category];
    const slotIndex = slots.findIndex(s => s.hardpointType === hpType && !s.weapon);
    if (slotIndex === -1) return;

    setFlashId(weapon.id);
    setTimeout(() => {
      setFlashId(null);
      onAddWeapon(weapon, slotIndex);
    }, 250);
  };

  const handleAddEquipment = (item: SlotItem, flashKey: string) => {
    if (remainingInventory < (item.kind === 'weapon' ? 0 : item.data.slots)) return;
    setFlashId(flashKey);
    setTimeout(() => {
      setFlashId(null);
      onAddEquipment(item);
    }, 250);
  };

  const handleOpenChange = (o: boolean) => {
    if (!o) {
      onClose();
      setTab('WEAPONS');
      setFilter('ALL');
      setSearch('');
    }
  };

  const locationLabel = LOCATION_LABELS[locationKey];

  const hsEffect = (hs: HeatSink) => {
    if (hs.subType === 'Standard') return `+${hs.dissipation} heat/turn`;
    if (hs.subType === 'HeatBank') return `+${hs.maxHeatBonus} max heat`;
    return `-${Math.round((1 - hs.weaponHeatReduction) * 100)}% weapon heat`;
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-w-lg p-0 border gap-0"
        style={{
          backgroundColor: '#161616',
          borderColor: '#2A2A2A',
          maxHeight: '80vh',
        }}
      >
        <DialogHeader className="p-4 pb-2">
          <DialogTitle
            className="font-mono uppercase tracking-wider"
            style={{ fontSize: 'var(--fs-card-title)', color: '#C87941' }}
          >
            {locationLabel} — ADD ITEM
          </DialogTitle>
        </DialogHeader>

        <div className="px-4 space-y-3">
          {/* Tabs */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
            {TABS.map((t) => {
              const disabled = t === 'JUMP JETS' && !jjAllowed;
              const active = tab === t;
              return (
                <button
                  key={t}
                  onClick={() => !disabled && setTab(t)}
                  disabled={disabled}
                  className={`shrink-0 px-3 py-1 font-mono uppercase tracking-wider rounded-sm border transition-colors ${
                    active
                      ? 'border-primary text-primary-foreground'
                      : disabled
                        ? 'bg-card text-muted-foreground/40 border-border/40 cursor-not-allowed'
                        : 'bg-card text-muted-foreground border-border hover:border-primary/50'
                  }`}
                  style={{
                    fontSize: 'var(--fs-badge)',
                    backgroundColor: active ? '#C87941' : undefined,
                  }}
                  title={disabled ? 'NOT AVAILABLE — HEAD / ARMS' : undefined}
                >
                  {t}
                </button>
              );
            })}
          </div>

          {/* Remaining slots summary (weapons tab) */}
          {tab === 'WEAPONS' && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono uppercase tracking-wider text-muted-foreground" style={{ fontSize: 11 }}>
                SLOTS REMAINING:
              </span>
              {remainingPills.length === 0 ? (
                <span className="font-mono uppercase" style={{ fontSize: 11, color: '#8A8A8A' }}>NONE</span>
              ) : (
                remainingPills.map((hp, i) => (
                  <span
                    key={i}
                    className={`px-1 py-0.5 font-mono rounded-sm ${HP_PILL_COLORS[hp] || ''}`}
                    style={{ fontSize: 10 }}
                  >
                    {hp}
                  </span>
                ))
              )}
            </div>
          )}

          {/* Inventory space indicator (non-weapons tabs) */}
          {tab !== 'WEAPONS' && (
            <div className="flex items-center gap-2">
              <span className="font-mono uppercase tracking-wider text-muted-foreground" style={{ fontSize: 11 }}>
                INVENTORY SPACE:
              </span>
              <span className="font-mono" style={{ fontSize: 11, color: remainingInventory <= 0 ? '#E05050' : '#8A8A8A' }}>
                {remainingInventory} / {inventorySlots}
              </span>
            </div>
          )}

          {/* Search */}
          <input
            type="text"
            placeholder={tab === 'WEAPONS' ? 'Search weapons...' : `Search ${tab.toLowerCase()}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-secondary border border-border rounded-sm px-3 py-2 font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            style={{ fontSize: 'var(--fs-body)' }}
          />

          {/* Weapon category filter chips (weapons tab only) */}
          {tab === 'WEAPONS' && (
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {chips.map((chip) => {
                const isAll = chip === 'ALL';
                const disabled = !isAll && !availableCategories.has(chip as Weapon['category']);
                const active = filter === chip;
                return (
                  <button
                    key={chip}
                    onClick={() => !disabled && setFilter(chip)}
                    disabled={disabled}
                    className={`shrink-0 px-3 py-1 font-mono uppercase tracking-wider rounded-sm border transition-colors ${
                      active
                        ? 'bg-primary text-primary-foreground border-primary'
                        : disabled
                          ? 'bg-card text-muted-foreground/40 border-border/40 cursor-not-allowed'
                          : 'bg-card text-muted-foreground border-border hover:border-primary/50'
                    }`}
                    style={{ fontSize: 'var(--fs-badge)' }}
                  >
                    {chip}
                  </button>
                );
              })}
              <button
                onClick={() => setTierFilter(!tierFilter)}
                className={`shrink-0 px-3 py-1 font-mono uppercase tracking-wider rounded-sm border transition-colors ${
                  tierFilter
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card text-muted-foreground border-border hover:border-primary/50'
                }`}
                style={{ fontSize: 'var(--fs-badge)' }}
              >
                TIER
              </button>
            </div>
          )}
        </div>

        {/* Item list */}
        <div className="overflow-y-auto px-4 pb-4 pt-2" style={{ maxHeight: 'calc(80vh - 260px)' }}>
          {tab === 'WEAPONS' && (
            <>
              {filteredWeapons.length === 0 ? (
                <EmptyState />
              ) : (
                <div className="space-y-2">
                  {filteredWeapons.map((w) => (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => handleAddWeapon(w)}
                      className="w-full text-left border border-border rounded-sm p-3 cursor-pointer min-h-[44px]"
                      style={{
                        backgroundColor: flashId === w.id ? 'rgba(200, 121, 65, 0.18)' : '#161616',
                        transition: flashId === w.id ? 'background-color 150ms ease-in' : 'background-color 100ms ease-out',
                      }}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span className="font-mono uppercase tracking-wider leading-tight" style={{ fontSize: 'var(--fs-card-title)', color: '#C87941' }}>
                          {w.name}
                        </span>
                        <span className={`px-1.5 py-0.5 font-mono uppercase rounded-sm shrink-0 ${CATEGORY_COLORS[w.category]}`} style={{ fontSize: 'var(--fs-badge)' }}>
                          {w.category}
                        </span>
                      </div>
                      {w.notes && (
                        <div className="font-mono mb-2" style={{ fontSize: 'var(--fs-badge)', color: '#8A8A8A' }}>
                          {w.notes}
                        </div>
                      )}
                      <div className="flex gap-3">
                        {[
                          { label: 'DMG', value: w.damage },
                          { label: 'HEAT', value: w.heat },
                          { label: 'TONS', value: w.tonnage },
                          { label: 'SLOTS', value: w.criticalSlots },
                        ].map((stat) => (
                          <StatBox key={stat.label} label={stat.label} value={stat.value} />
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {tab === 'AMMO' && (
            <>
              {filteredAmmo.length === 0 ? (
                <EmptyState />
              ) : (
                <div className="space-y-2">
                  {filteredAmmo.map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => handleAddEquipment({ kind: 'ammo', data: a }, a.id)}
                      disabled={remainingInventory < a.slots}
                      className="w-full text-left border border-border rounded-sm p-3 cursor-pointer min-h-[44px] disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{
                        backgroundColor: flashId === a.id ? 'rgba(200, 121, 65, 0.18)' : '#161616',
                        transition: flashId === a.id ? 'background-color 150ms ease-in' : 'background-color 100ms ease-out',
                      }}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono uppercase tracking-wider leading-tight" style={{ fontSize: 'var(--fs-card-title)', color: '#C87941' }}>
                            {a.name}
                          </span>
                          {a.canExplode && (
                            <span className="font-mono uppercase rounded-sm px-1 py-0.5" style={{ fontSize: 'var(--fs-badge)', backgroundColor: '#C87941', color: '#0D0D0D' }}>
                              💥 AMMO
                            </span>
                          )}
                          {a.isLosTech && (
                            <span className="font-mono uppercase rounded-sm px-1 py-0.5" style={{ fontSize: 'var(--fs-badge)', backgroundColor: '#C87941', color: '#0D0D0D' }}>
                              LOSTECH
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <StatBox label="ROUNDS" value={a.capacity} />
                        <StatBox label="TONS" value={a.tonnage} />
                        <StatBox label="SLOTS" value={a.slots} />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {tab === 'HEAT SINKS' && (
            <>
              {filteredHS.length === 0 ? (
                <EmptyState />
              ) : (
                <div className="space-y-2">
                  {filteredHS.map((hs) => (
                    <button
                      key={hs.id}
                      type="button"
                      onClick={() => handleAddEquipment({ kind: 'heatSink', data: hs }, hs.id)}
                      disabled={remainingInventory < hs.slots}
                      className="w-full text-left border border-border rounded-sm p-3 cursor-pointer min-h-[44px] disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{
                        backgroundColor: flashId === hs.id ? 'rgba(200, 121, 65, 0.18)' : '#161616',
                        transition: flashId === hs.id ? 'background-color 150ms ease-in' : 'background-color 100ms ease-out',
                      }}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono uppercase tracking-wider leading-tight" style={{ fontSize: 'var(--fs-card-title)', color: '#C87941' }}>
                            {hs.name}
                          </span>
                          {hs.isLosTech && (
                            <span className="font-mono uppercase rounded-sm px-1 py-0.5" style={{ fontSize: 'var(--fs-badge)', backgroundColor: '#C87941', color: '#0D0D0D' }}>
                              LOSTECH
                            </span>
                          )}
                        </div>
                        <span className="font-mono uppercase rounded-sm px-1.5 py-0.5 shrink-0" style={{ fontSize: 'var(--fs-badge)', backgroundColor: '#3A7A8A', color: '#E0E0E0' }}>
                          {hsEffect(hs)}
                        </span>
                      </div>
                      <div className="flex gap-3">
                        <StatBox label="TONS" value={hs.tonnage} />
                        <StatBox label="SLOTS" value={hs.slots} />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {tab === 'JUMP JETS' && (
            <>
              {!jjAllowed ? (
                <div className="flex items-center justify-center py-8">
                  <span className="font-mono uppercase" style={{ fontSize: 'var(--fs-body)', color: '#8A8A8A' }}>
                    NOT AVAILABLE — HEAD / ARMS
                  </span>
                </div>
              ) : filteredJJ.length === 0 ? (
                <EmptyState />
              ) : mech.jumpJetsMax === 0 ? (
                <div className="space-y-2">
                  {filteredJJ.map((jj) => (
                    <div
                      key={jj.id}
                      className="w-full text-left border border-border rounded-sm p-3 min-h-[44px] opacity-40"
                      style={{ backgroundColor: '#161616' }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-mono uppercase tracking-wider" style={{ fontSize: 'var(--fs-card-title)', color: '#8A8A8A' }}>
                          {jj.name}
                        </span>
                        <span className="font-mono uppercase" style={{ fontSize: 'var(--fs-badge)', color: '#E05050' }}>
                          MAX JUMP JETS REACHED
                        </span>
                      </div>
                      <div className="flex gap-3">
                        <StatBox label="TONS" value={jj.tonnage} />
                        <StatBox label="SLOTS" value={jj.slots} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredJJ.map((jj) => {
                    const maxed = jjMaxReached;
                    return (
                      <button
                        key={jj.id}
                        type="button"
                        onClick={() => !maxed && handleAddEquipment({ kind: 'jumpJet', data: jj }, jj.id)}
                        disabled={maxed || remainingInventory < jj.slots}
                        className="w-full text-left border border-border rounded-sm p-3 cursor-pointer min-h-[44px] disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{
                          backgroundColor: flashId === jj.id ? 'rgba(200, 121, 65, 0.18)' : '#161616',
                          transition: flashId === jj.id ? 'background-color 150ms ease-in' : 'background-color 100ms ease-out',
                        }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-mono uppercase tracking-wider leading-tight" style={{ fontSize: 'var(--fs-card-title)', color: maxed ? '#8A8A8A' : '#C87941' }}>
                            {jj.name}
                          </span>
                          {maxed && (
                            <span className="font-mono uppercase" style={{ fontSize: 'var(--fs-badge)', color: '#E05050' }}>
                              MAX JUMP JETS REACHED
                            </span>
                          )}
                        </div>
                        <div className="flex gap-3">
                          <StatBox label="TONS" value={jj.tonnage} />
                          <StatBox label="SLOTS" value={jj.slots} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const EmptyState = () => (
  <div className="flex items-center justify-center py-8">
    <span className="font-mono uppercase" style={{ fontSize: 'var(--fs-body)', color: '#8A8A8A' }}>
      NO COMPATIBLE ITEMS
    </span>
  </div>
);

const StatBox = ({ label, value }: { label: string; value: number }) => (
  <div className="border border-border rounded-sm px-2 py-1 text-center min-w-[42px]" style={{ backgroundColor: '#0D0D0D' }}>
    <div className="font-mono text-muted-foreground tracking-wider" style={{ fontSize: 'var(--fs-badge)' }}>{label}</div>
    <div className="font-mono text-foreground" style={{ fontSize: 'var(--fs-body)' }}>{value}</div>
  </div>
);

export default UnifiedWeaponPicker;
