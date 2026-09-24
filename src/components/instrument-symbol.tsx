import { cn } from "@/lib/utils";

const symbolMap: Record<string, { glyph: string; tone: string }> = {
  NIFTY: { glyph: "N", tone: "bg-primary/15 text-primary" },
  "BANK NIFTY": { glyph: "BN", tone: "bg-intelligence/15 text-intelligence" },
  SENSEX: { glyph: "SX", tone: "bg-warning/15 text-warning" },
};

export function InstrumentSymbol({
  instrument,
  className,
}: {
  instrument: string;
  className?: string;
}) {
  const key = Object.keys(symbolMap).find((k) => instrument.startsWith(k));
  const { glyph, tone } = key ? symbolMap[key] : { glyph: instrument.slice(0, 2).toUpperCase(), tone: "bg-surface-2 text-muted" };

  return (
    <span
      className={cn(
        "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--radius-sm)] font-mono text-[11px] font-semibold",
        tone,
        className,
      )}
      aria-hidden="true"
    >
      {glyph}
    </span>
  );
}
