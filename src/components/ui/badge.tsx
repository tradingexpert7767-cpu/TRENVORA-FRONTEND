import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef } from "react";

type Tone = "neutral" | "positive" | "negative" | "warning" | "intelligence";

const tones: Record<Tone, string> = {
  neutral: "bg-surface-2 text-muted border-border-strong",
  positive: "bg-positive/10 text-positive border-positive/25",
  negative: "bg-negative/10 text-negative border-negative/25",
  warning: "bg-warning/10 text-warning border-warning/25",
  intelligence: "bg-intelligence/10 text-intelligence border-intelligence/25",
};

export function Badge({
  tone = "neutral",
  className,
  ...props
}: ComponentPropsWithoutRef<"span"> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
