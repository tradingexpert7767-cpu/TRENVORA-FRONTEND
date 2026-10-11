"use client";

import { cn } from "@/lib/utils";
import type { OptionChainRow } from "@/lib/market-data-provider";

export function OptionChain({
  rows,
  spot,
  onSelect,
  instrument = "",
}: {
  rows: OptionChainRow[];
  spot: number;
  onSelect: (leg: "CE" | "PE", strike: number, premium: number) => void;
  /** Underlying name, used in button labels for screen readers. */
  instrument?: string;
}) {
  const atmStrike = rows.reduce(
    (closest, r) => (Math.abs(r.strike - spot) < Math.abs(closest - spot) ? r.strike : closest),
    rows[0]?.strike ?? spot,
  );

  return (
    <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-border">
      <table className="w-full min-w-[720px] border-collapse text-xs tabular-nums">
        <caption className="sr-only">
          {instrument} option chain. Calls on the left, puts on the right; in-the-money premiums are shaded. Select a premium to buy that option.
        </caption>
        <thead className="bg-surface-2 text-xs uppercase tracking-wide text-muted">
          <tr>
            <th className="px-3 py-2.5 text-right font-medium">OI</th>
            <th className="px-3 py-2.5 text-right font-medium">Volume</th>
            <th className="px-3 py-2.5 text-right font-medium">IV</th>
            <th className="px-3 py-2.5 text-right font-medium text-positive">LTP (CE)</th>
            <th className="bg-surface px-3 py-2.5 text-center font-semibold text-foreground">
              Strike
            </th>
            <th className="px-3 py-2.5 text-left font-medium text-negative">LTP (PE)</th>
            <th className="px-3 py-2.5 text-left font-medium">IV</th>
            <th className="px-3 py-2.5 text-left font-medium">Volume</th>
            <th className="px-3 py-2.5 text-left font-medium">OI</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((row) => {
            const isAtm = row.strike === atmStrike;
            const ceItm = row.strike < spot;
            const peItm = row.strike > spot;
            return (
              <tr key={row.strike} className={cn(isAtm && "bg-primary/5")}>
                <td className="px-3 py-2 text-right text-muted">{formatCompact(row.ce.oi)}</td>
                <td className="px-3 py-2 text-right text-muted">{formatCompact(row.ce.volume)}</td>
                <td className="px-3 py-2 text-right text-muted">{row.ce.iv.toFixed(1)}</td>
                <td className={cn("p-1 text-right", ceItm && "bg-positive/5")}>
                  <button
                    type="button"
                    onClick={() => onSelect("CE", row.strike, row.ce.ltp)}
                    aria-label={`Buy ${instrument} ${row.strike} CE at ${row.ce.ltp.toFixed(2)}`}
                    className={cn(
                      "min-h-10 w-full cursor-pointer rounded-[var(--radius-sm)] px-2.5 py-1.5 text-right font-mono font-medium transition-colors hover:bg-positive/15",
                      ceItm ? "text-foreground" : "text-positive",
                    )}
                  >
                    {row.ce.ltp.toFixed(2)}
                  </button>
                </td>
                <td
                  className={cn(
                    "bg-surface px-3 py-2 text-center font-mono font-semibold",
                    isAtm && "text-primary",
                  )}
                >
                  {row.strike.toLocaleString("en-IN")}
                </td>
                <td className={cn("p-1 text-left", peItm && "bg-negative/5")}>
                  <button
                    type="button"
                    onClick={() => onSelect("PE", row.strike, row.pe.ltp)}
                    aria-label={`Buy ${instrument} ${row.strike} PE at ${row.pe.ltp.toFixed(2)}`}
                    className={cn(
                      "min-h-10 w-full cursor-pointer rounded-[var(--radius-sm)] px-2.5 py-1.5 text-left font-mono font-medium transition-colors hover:bg-negative/15",
                      peItm ? "text-foreground" : "text-negative",
                    )}
                  >
                    {row.pe.ltp.toFixed(2)}
                  </button>
                </td>
                <td className="px-3 py-2 text-left text-muted">{row.pe.iv.toFixed(1)}</td>
                <td className="px-3 py-2 text-left text-muted">{formatCompact(row.pe.volume)}</td>
                <td className="px-3 py-2 text-left text-muted">{formatCompact(row.pe.oi)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function formatCompact(n: number) {
  if (n >= 100000) return `${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}
