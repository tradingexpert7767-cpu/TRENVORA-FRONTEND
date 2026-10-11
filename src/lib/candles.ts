export type Candle = {
  time: number; // unix seconds
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

// Deterministic pseudo-random generator (mulberry32) so mock sessions are
// stable across reloads instead of reshuffling every render.
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateSession({
  basePrice,
  candles = 78,
  intervalMinutes = 3,
  startHour = 9,
  startMinute = 15,
  volatility = 0.0011,
  drift = 0.00006,
  seed = 1,
  dateOffsetDays = 0,
  date,
}: {
  basePrice: number;
  candles?: number;
  intervalMinutes?: number;
  startHour?: number;
  startMinute?: number;
  volatility?: number;
  drift?: number;
  seed?: number;
  dateOffsetDays?: number;
  /** Fixed session date (YYYY-MM-DD, IST). Overrides dateOffsetDays. */
  date?: string;
}): Candle[] {
  const rand = mulberry32(seed);
  // Session times are exchange time (IST, UTC+5:30) regardless of where the
  // code runs, so server and browser generate identical candles.
  const IST_OFFSET_MINUTES = 330;
  const day = date ? new Date(`${date}T00:00:00Z`) : new Date(Date.now() + IST_OFFSET_MINUTES * 60_000);
  const startMs =
    Date.UTC(
      day.getUTCFullYear(),
      day.getUTCMonth(),
      day.getUTCDate() - (date ? 0 : dateOffsetDays),
      startHour,
      startMinute,
    ) -
    IST_OFFSET_MINUTES * 60_000;
  const startTime = Math.floor(startMs / 1000);

  let price = basePrice;
  const out: Candle[] = [];

  for (let i = 0; i < candles; i++) {
    const open = price;
    const change = (rand() - 0.5) * 2 * volatility + drift;
    const close = open * (1 + change);
    const wickUp = open * (rand() * volatility * 0.8);
    const wickDown = open * (rand() * volatility * 0.8);
    const high = Math.max(open, close) + wickUp;
    const low = Math.min(open, close) - wickDown;
    const volume = Math.round(4000 + rand() * 12000);

    out.push({
      time: startTime + i * intervalMinutes * 60,
      open: round2(open),
      high: round2(high),
      low: round2(low),
      close: round2(close),
      volume,
    });

    price = close;
  }

  return out;
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

export const liveSessionCandles: Record<string, Candle[]> = {
  NIFTY: generateSession({ basePrice: 24680, seed: 11, drift: 0.00008 }),
  "BANK NIFTY": generateSession({ basePrice: 51100, seed: 22, drift: 0.00006, volatility: 0.0013 }),
  SENSEX: generateSession({ basePrice: 80600, seed: 33, drift: 0.00005, volatility: 0.0009 }),
};

export const replaySessionCandles: Record<string, Candle[]> = {
  // Dates and start times match the session cards in replay-desk and on /replay;
  // each session stops by the 15:30 close.
  "18-sep-nifty": generateSession({ basePrice: 24500, seed: 101, date: "2026-09-18", startHour: 9, startMinute: 30, drift: 0.00015, volatility: 0.0014 }),
  "02-sep-bank-nifty": generateSession({ basePrice: 50800, seed: 202, date: "2026-09-02", startHour: 10, startMinute: 15, drift: 0.00001, volatility: 0.0007 }),
  "21-aug-sensex": generateSession({ basePrice: 80100, seed: 303, date: "2026-08-21", startHour: 14, startMinute: 0, candles: 30, drift: 0.00022, volatility: 0.0016 }),
};
