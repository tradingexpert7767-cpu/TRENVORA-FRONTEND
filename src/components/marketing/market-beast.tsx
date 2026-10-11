"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

// Public-domain silhouettes (Wikimedia Commons, CC0 / public domain):
// bull — LadyofHats, "Bull silhouette 02.svg"; bear — The Noun Project via
// Wikimedia, "Bear (653).svg". Recolored here via CSS mask so a single flat
// brand color (teal for bull, red for bear) replaces the source artwork's
// own fill, matching the product's glow treatment instead of stock colors.

const sources = {
  bull: "/illustrations/bull.svg",
  bear: "/illustrations/bear.svg",
};

export function MarketBeast({
  kind,
  className,
}: {
  kind: "bull" | "bear";
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const color = kind === "bull" ? "var(--color-positive)" : "var(--color-negative)";

  return (
    <motion.div
      className={cn("pointer-events-none", className)}
      animate={reduceMotion ? undefined : { y: [0, kind === "bull" ? -6 : 6, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    >
      <div
        aria-hidden="true"
        className="h-full w-full"
        style={{
          backgroundColor: color,
          filter: `drop-shadow(0 0 18px color-mix(in oklab, ${color} 55%, transparent))`,
          WebkitMaskImage: `url(${sources[kind]})`,
          maskImage: `url(${sources[kind]})`,
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskSize: "contain",
          maskSize: "contain",
          WebkitMaskPosition: "center",
          maskPosition: "center",
        }}
      />
    </motion.div>
  );
}
