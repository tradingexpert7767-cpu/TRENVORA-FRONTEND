"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { useThemeColors } from "@/hooks/use-theme-colors";

type Point = { label: string; equity: number };

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function EquityCurveChart({ data }: { data: Point[] }) {
  const chartColors = useThemeColors();
  const first = data[0]?.equity ?? 0;
  const last = data[data.length - 1]?.equity ?? 0;
  // Line colour follows the direction of the curve, not a fixed "good" green.
  const line = last >= first ? chartColors.positive : chartColors.negative;
  const fmt = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
  return (
    <div
      className="h-64 w-full"
      role="img"
      aria-label={`Equity curve from ${fmt(first)} to ${fmt(last)} over ${data.length} points`}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="equityFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={line} stopOpacity={0.28} />
              <stop offset="100%" stopColor={line} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={chartColors.border} vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: chartColors.muted, fontSize: 12 }}
            axisLine={{ stroke: chartColors.border }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: chartColors.muted, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={56}
            tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip
            cursor={{ stroke: chartColors.border, strokeWidth: 1 }}
            contentStyle={{
              background: "var(--color-surface-2)",
              border: "1px solid var(--color-border-strong)",
              borderRadius: "var(--radius-md)",
              fontSize: 12,
              color: "var(--color-foreground)",
            }}
            labelStyle={{ color: "var(--color-muted)" }}
            formatter={(value) => [`₹${Number(value).toLocaleString("en-IN")}`, "Equity"]}
          />
          <Area
            type="monotone"
            dataKey="equity"
            stroke={line}
            strokeWidth={2}
            isAnimationActive={!prefersReducedMotion()}
            fill="url(#equityFill)"
            dot={false}
            activeDot={{ r: 4, fill: line, stroke: chartColors.surface, strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
