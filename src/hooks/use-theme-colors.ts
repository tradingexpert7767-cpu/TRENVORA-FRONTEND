"use client";

import { useSyncExternalStore } from "react";
import { chartColors, type ChartPalette } from "@/lib/chart-colors";

const TOKENS: Record<keyof ChartPalette, string> = {
  primary: "--primary",
  positive: "--positive",
  negative: "--negative",
  warning: "--warning",
  intelligence: "--intelligence",
  border: "--border",
  muted: "--muted",
  mutedStrong: "--muted-2",
  foreground: "--foreground",
  surface: "--surface",
};

let cached: ChartPalette | null = null;

function read(): ChartPalette {
  const styles = getComputedStyle(document.documentElement);
  const next = { ...chartColors };
  for (const [key, token] of Object.entries(TOKENS) as [keyof ChartPalette, string][]) {
    const value = styles.getPropertyValue(token).trim();
    if (value) next[key] = value;
  }
  return next;
}

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(() => {
    cached = read();
    onChange();
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

function getSnapshot() {
  cached ??= read();
  return cached;
}

/**
 * Resolved design-token colors for canvas/SVG charts, which can't use CSS
 * var(). Re-renders when the theme toggle flips `data-theme`.
 */
export function useThemeColors(): ChartPalette {
  return useSyncExternalStore(subscribe, getSnapshot, () => chartColors);
}
