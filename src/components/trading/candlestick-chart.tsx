"use client";

import { useEffect, useRef } from "react";
import {
  createChart,
  CandlestickSeries,
  HistogramSeries,
  ColorType,
  TickMarkType,
  type IChartApi,
  type Time,
  type ISeriesApi,
  type UTCTimestamp,
} from "lightweight-charts";
import type { Candle } from "@/lib/candles";
import type { ChartPalette } from "@/lib/chart-colors";
import { useThemeColors } from "@/hooks/use-theme-colors";

// Canvas can't resolve CSS variables, so pass the concrete font stack.
const FONT_FAMILY = "Inter, ui-sans-serif, system-ui, sans-serif";

// Indian index sessions: show exchange time (IST) whatever the viewer's
// timezone — lightweight-charts would otherwise label the axis in UTC.
const istTime = new Intl.DateTimeFormat("en-IN", {
  timeZone: "Asia/Kolkata",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});
const istDate = new Intl.DateTimeFormat("en-IN", {
  timeZone: "Asia/Kolkata",
  day: "numeric",
  month: "short",
});

function toDate(time: Time) {
  return new Date((time as number) * 1000);
}

function tickMarkFormatter(time: Time, type: TickMarkType) {
  const date = toDate(time);
  return type === TickMarkType.Time || type === TickMarkType.TimeWithSeconds
    ? istTime.format(date)
    : istDate.format(date);
}

function crosshairTimeFormatter(time: Time) {
  const date = toDate(time);
  return `${istDate.format(date)} ${istTime.format(date)} IST`;
}

function chartTheme(colors: ChartPalette) {
  return {
    layout: {
      background: { type: ColorType.Solid, color: "transparent" },
      textColor: colors.muted,
      fontFamily: FONT_FAMILY,
      fontSize: 12,
    },
    grid: {
      vertLines: { color: colors.border },
      horzLines: { color: colors.border },
    },
    rightPriceScale: { borderColor: colors.border },
    timeScale: { borderColor: colors.border },
  };
}

function volumeColor(c: Candle, colors: ChartPalette) {
  return c.close >= c.open ? `${colors.positive}55` : `${colors.negative}55`;
}

export function CandlestickChart({
  data,
  height = 360,
  label,
}: {
  data: Candle[];
  height?: number;
  /** Screen-reader summary, e.g. "NIFTY intraday candlestick chart". */
  label?: string;
}) {
  const colors = useThemeColors();
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const volumeRef = useRef<ISeriesApi<"Histogram"> | null>(null);
  const colorsRef = useRef(colors);
  // First candle's timestamp identifies the session; only a new session
  // re-fits the view, so live ticks don't wipe the user's zoom/pan.
  const sessionRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      ...chartTheme(colorsRef.current),
      timeScale: {
        ...chartTheme(colorsRef.current).timeScale,
        timeVisible: true,
        secondsVisible: false,
        tickMarkFormatter,
      },
      localization: { timeFormatter: crosshairTimeFormatter },
      crosshair: { mode: 0 },
      autoSize: true,
      height,
    });

    const series = chart.addSeries(CandlestickSeries, {
      upColor: colorsRef.current.positive,
      downColor: colorsRef.current.negative,
      borderVisible: false,
      wickUpColor: colorsRef.current.positive,
      wickDownColor: colorsRef.current.negative,
    });

    const volume = chart.addSeries(HistogramSeries, {
      priceFormat: { type: "volume" },
      priceScaleId: "volume",
    });
    volume.priceScale().applyOptions({
      scaleMargins: { top: 0.85, bottom: 0 },
    });

    chartRef.current = chart;
    seriesRef.current = series;
    volumeRef.current = volume;
    sessionRef.current = null;

    return () => {
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
      volumeRef.current = null;
    };
  }, [height]);

  // Re-theme in place when the light/dark toggle flips.
  useEffect(() => {
    colorsRef.current = colors;
    chartRef.current?.applyOptions(chartTheme(colors));
    seriesRef.current?.applyOptions({
      upColor: colors.positive,
      downColor: colors.negative,
      wickUpColor: colors.positive,
      wickDownColor: colors.negative,
    });
    volumeRef.current?.setData(
      data.map((c) => ({ time: c.time as UTCTimestamp, value: c.volume, color: volumeColor(c, colors) })),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps -- volume colors are refreshed for theme changes only; data changes are handled below.
  }, [colors]);

  useEffect(() => {
    if (!seriesRef.current || !volumeRef.current) return;
    const session = data[0]?.time ?? null;
    const last = data[data.length - 1];

    if (session === sessionRef.current && last) {
      seriesRef.current.update({
        time: last.time as UTCTimestamp,
        open: last.open,
        high: last.high,
        low: last.low,
        close: last.close,
      });
      volumeRef.current.update({
        time: last.time as UTCTimestamp,
        value: last.volume,
        color: volumeColor(last, colorsRef.current),
      });
      return;
    }

    seriesRef.current.setData(
      data.map((c) => ({
        time: c.time as UTCTimestamp,
        open: c.open,
        high: c.high,
        low: c.low,
        close: c.close,
      })),
    );
    volumeRef.current.setData(
      data.map((c) => ({ time: c.time as UTCTimestamp, value: c.volume, color: volumeColor(c, colorsRef.current) })),
    );
    chartRef.current?.timeScale().fitContent();
    sessionRef.current = session;
  }, [data, height]);

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={label ?? "Candlestick price chart"}
      className="w-full"
      style={{ height }}
    />
  );
}
