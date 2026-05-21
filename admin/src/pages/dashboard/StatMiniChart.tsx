import { Area, AreaChart, ResponsiveContainer } from "recharts";

const seedSeries = (key: string, trend: "up" | "down" | "flat") => {
  let v = 40 + (key.charCodeAt(0) % 20);
  return Array.from({ length: 8 }, (_, i) => {
    const delta =
      trend === "up" ? 4 + (i % 3) : trend === "down" ? -3 - (i % 2) : (i % 2) - 1;
    v = Math.max(12, Math.min(88, v + delta));
    return { i, v };
  });
};

interface StatMiniChartProps {
  color: string;
  /** Stable key so the spark shape stays consistent per card. */
  seriesKey: string;
  trend: "up" | "down" | "flat";
}

/** Minimal-style micro area chart for stat widgets (see simple-vite-ts ecommerce cards). */
export function StatMiniChart({ color, seriesKey, trend }: StatMiniChartProps) {
  const data = seedSeries(seriesKey, trend);
  const gid = seriesKey.replace(/\W/g, "") || "spark";
  const gradId = `g-${gid}`;
  return (
    <div className="h-12 w-[72px] shrink-0 [&_.recharts-surface]:outline-none">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={2}
            fill={`url(#${gradId})`}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
