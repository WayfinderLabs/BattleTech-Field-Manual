/** Shared hardpoint pill utilities used by MechDetailScreen and LocationCard */

export const HP_PILL_COLORS: Record<string, string> = {
  B: "bg-[hsl(220,9%,46%)]",
  E: "bg-[hsl(217,91%,60%)]",
  M: "bg-[hsl(142,71%,45%)] !text-black",
  S: "bg-[hsl(48,96%,53%)] !text-black",
};

export function parseHardpointTokens(str: string): { type: string; count: number }[] {
  if (!str || str === "—") return [];
  return str.trim().split(/\s+/).reduce<{ type: string; count: number }[]>((acc, token) => {
    const m = token.match(/^(\d+)([BEMS])$/);
    if (m) acc.push({ type: m[2], count: parseInt(m[1], 10) });
    return acc;
  }, []);
}
