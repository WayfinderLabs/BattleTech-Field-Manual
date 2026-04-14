import { useMemo } from "react";
import { EQUIPMENT, type Equipment } from "@/data/equipment";

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

const EquipmentScreen = () => {
  const grouped = useMemo(() => {
    const map = new Map<Equipment["category"], Equipment[]>();
    for (const cat of SECTION_ORDER) {
      const items = EQUIPMENT.filter((e) => e.category === cat);
      if (items.length > 0) map.set(cat, items);
    }
    return map;
  }, []);

  return (
    <div className="py-4 space-y-4">
      <h2 className="text-primary text-heading font-mono tracking-[0.15em]">// EQUIPMENT REFERENCE</h2>

      {SECTION_ORDER.map((cat) => {
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
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EquipmentScreen;
