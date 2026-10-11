import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

// Decorative symbol motif only — no prices or percentages, so nothing here
// reads as live or claimed market data. Purely a visual pattern reinforcing
// the trading theme in otherwise-empty header space.
const symbols = [
  { label: "NIFTY 50", up: true },
  { label: "SENSEX", up: true },
  { label: "BANK NIFTY", up: false },
  { label: "RELIANCE", up: true },
  { label: "TCS", up: false },
  { label: "INFY", up: true },
  { label: "HDFC BANK", up: false },
  { label: "ITC", up: true },
];

function TickerRow({ ariaHidden }: { ariaHidden?: boolean }) {
  return (
    <div className="flex shrink-0 items-center gap-8 pr-8" aria-hidden={ariaHidden}>
      {symbols.map(({ label, up }, index) => (
        <span
          key={`${label}-${index}`}
          className="inline-flex items-center gap-1.5 text-xs font-medium tracking-wide text-muted-2"
        >
          {up ? (
            <TrendingUp className="h-3.5 w-3.5 text-positive/70" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5 text-negative/70" />
          )}
          {label}
        </span>
      ))}
    </div>
  );
}

export function TickerStrip({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "group relative mt-10 flex overflow-hidden border-t border-border/70 py-4 [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]",
        className,
      )}
    >
      <div className="flex shrink-0 animate-[ticker_36s_linear_infinite] motion-reduce:animate-none">
        <TickerRow />
        <TickerRow ariaHidden />
        <TickerRow ariaHidden />
      </div>
    </div>
  );
}
