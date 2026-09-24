// SVG presentation attributes (recharts' stroke/fill props) don't reliably
// resolve CSS var() the way style properties do, so chart color values are
// kept here as literal hex, mirrored from the tokens in globals.css.
export const chartColors = {
  primary: "#5b8def",
  positive: "#22c55e",
  negative: "#ef4444",
  warning: "#f59e0b",
  intelligence: "#8b7cf6",
  border: "#23262f",
  muted: "#9297a3",
  mutedStrong: "#6a6f7b",
} as const;

export type ChartTone = "positive" | "negative" | "warning" | "intelligence";
