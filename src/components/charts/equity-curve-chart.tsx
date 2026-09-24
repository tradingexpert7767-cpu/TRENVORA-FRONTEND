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
import { chartColors } from "@/lib/chart-colors";

type Point = { label: string; equity: number };

export function EquityCurveChart({ data }: { data: Point[] }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="equityFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={chartColors.positive} stopOpacity={0.28} />
              <stop offset="100%" stopColor={chartColors.positive} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={chartColors.border} vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: chartColors.mutedStrong, fontSize: 11 }}
            axisLine={{ stroke: chartColors.border }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: chartColors.mutedStrong, fontSize: 11 }}
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
            stroke={chartColors.positive}
            strokeWidth={2}
            fill="url(#equityFill)"
            dot={false}
            activeDot={{ r: 4, fill: chartColors.positive, stroke: chartColors.border, strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
