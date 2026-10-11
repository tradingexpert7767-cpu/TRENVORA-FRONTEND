"use client";

import { ResponsiveContainer, LineChart, Line, YAxis } from "recharts";
import type { ChartTone } from "@/lib/chart-colors";
import { useThemeColors } from "@/hooks/use-theme-colors";

export function Sparkline({
  data,
  tone = "positive",
}: {
  data: number[];
  tone?: ChartTone;
}) {
  const points = data.map((value, index) => ({ index, value }));
  const color = useThemeColors()[tone];

  return (
    <div className="h-10 w-24" aria-hidden="true">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={points} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
          <YAxis hide domain={["dataMin", "dataMax"]} />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
