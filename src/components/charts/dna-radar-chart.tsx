"use client";

import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
} from "recharts";
import { useThemeColors } from "@/hooks/use-theme-colors";

type Trait = { label: string; score: number };

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function DnaRadarChart({ data }: { data: Trait[] }) {
  const chartColors = useThemeColors();
  const summary = data.map((d) => `${d.label} ${d.score}`).join(", ");
  return (
    <div className="h-72 w-full" role="img" aria-label={`Trading DNA radar chart: ${summary}`}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="72%">
          <PolarGrid stroke={chartColors.border} />
          <PolarAngleAxis
            dataKey="label"
            tick={{ fill: chartColors.muted, fontSize: 12 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: chartColors.muted, fontSize: 11 }}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              background: "var(--color-surface-2)",
              border: "1px solid var(--color-border-strong)",
              borderRadius: "var(--radius-md)",
              fontSize: 12,
              color: "var(--color-foreground)",
            }}
            labelStyle={{ color: "var(--color-muted)" }}
          />
          <Radar
            dataKey="score"
            stroke={chartColors.intelligence}
            fill={chartColors.intelligence}
            fillOpacity={0.22}
            strokeWidth={2}
            isAnimationActive={!prefersReducedMotion()}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
