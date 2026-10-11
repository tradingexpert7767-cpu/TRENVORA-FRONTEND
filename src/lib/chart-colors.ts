// Dark-theme fallbacks for charts, mirrored from globals.css. Components
// should prefer `useThemeColors()`, which resolves the live tokens so charts
// follow the light/dark toggle; these values are only the SSR snapshot.
export type ChartPalette = {
  primary: string;
  positive: string;
  negative: string;
  warning: string;
  intelligence: string;
  border: string;
  muted: string;
  mutedStrong: string;
  foreground: string;
  surface: string;
};

export const chartColors: ChartPalette = {
  primary: "#19e6b3",
  positive: "#21d68f",
  negative: "#ff5263",
  warning: "#f5a623",
  intelligence: "#7c9dff",
  border: "rgba(255, 255, 255, 0.08)",
  muted: "#8ea3b7",
  mutedStrong: "#7790a6",
  foreground: "#f4f8fb",
  surface: "#081522",
};

export type ChartTone = "positive" | "negative" | "warning" | "intelligence";
