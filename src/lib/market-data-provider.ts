// Market-data provider abstraction (spec: never hardcode a data source into
// the UI). Today `activeProvider` is `mockMarketDataProvider` — generated,
// deterministic data. When a licensed live feed (e.g. Dhan) is wired, it
// happens server-side only (the API key never reaches the client): a Next.js
// route handler calls the vendor API and this file's provider fetches from
// that route instead of generating numbers. No component below this file
// needs to change.

export type OptionLeg = {
  strike: number;
  ltp: number;
  oi: number;
  oiChangePct: number;
  iv: number;
  volume: number;
};

export type OptionChainRow = {
  strike: number;
  ce: OptionLeg;
  pe: OptionLeg;
};

export type Expiry = { id: string; label: string };

export interface MarketDataProvider {
  getExpiries(instrument: string): Expiry[];
  getOptionChain(instrument: string, expiryId: string, spot: number): OptionChainRow[];
}

const STRIKE_INTERVAL: Record<string, number> = {
  NIFTY: 50,
  "BANK NIFTY": 100,
  SENSEX: 100,
};

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

function hashString(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return h;
}

class MockMarketDataProvider implements MarketDataProvider {
  getExpiries(instrument: string): Expiry[] {
    const today = new Date();
    const nextThursday = new Date(today);
    nextThursday.setDate(today.getDate() + ((4 - today.getDay() + 7) % 7 || 7));

    const fmt = (d: Date) =>
      d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });

    const weeklyLabel = instrument === "NIFTY" ? "Weekly" : "Monthly";
    const w1 = new Date(nextThursday);
    const w2 = new Date(nextThursday);
    w2.setDate(w1.getDate() + 7);
    const w3 = new Date(nextThursday);
    w3.setDate(w1.getDate() + 28);

    return [
      { id: "w1", label: `${fmt(w1)} (${weeklyLabel})` },
      { id: "w2", label: fmt(w2) },
      { id: "w3", label: fmt(w3) },
    ];
  }

  getOptionChain(instrument: string, expiryId: string, spot: number): OptionChainRow[] {
    const interval = STRIKE_INTERVAL[instrument] ?? 50;
    const atm = Math.round(spot / interval) * interval;
    const expiryFactor = expiryId === "w1" ? 1 : expiryId === "w2" ? 1.8 : 3.2;
    // Seeded by instrument+expiry only (not spot) so OI/volume/IV stay
    // stable tick to tick — only premiums move as the spot price ticks.
    const seedBase = hashString(instrument + expiryId);
    const rand = mulberry32(seedBase);

    const rows: OptionChainRow[] = [];
    for (let i = -7; i <= 7; i++) {
      const strike = atm + i * interval;
      const distance = Math.abs(strike - spot);
      const ivBase = 12 + (distance / spot) * 180; // smile: further from ATM = higher IV
      const timeValue = Math.max(4, (40 - distance / (interval * 0.6)) * expiryFactor);

      const ceIntrinsic = Math.max(0, spot - strike);
      const peIntrinsic = Math.max(0, strike - spot);

      const ceLtp = round2(ceIntrinsic + timeValue * (0.6 + rand() * 0.3));
      const peLtp = round2(peIntrinsic + timeValue * (0.6 + rand() * 0.3));

      const proximityWeight = Math.max(0.1, 1 - distance / (interval * 8));

      rows.push({
        strike,
        ce: {
          strike,
          ltp: ceLtp,
          oi: Math.round(proximityWeight * (50000 + rand() * 400000)),
          oiChangePct: round2((rand() - 0.5) * 30),
          iv: round2(ivBase * (0.95 + rand() * 0.1)),
          volume: Math.round(proximityWeight * (20000 + rand() * 200000)),
        },
        pe: {
          strike,
          ltp: peLtp,
          oi: Math.round(proximityWeight * (50000 + rand() * 400000)),
          oiChangePct: round2((rand() - 0.5) * 30),
          iv: round2(ivBase * (0.95 + rand() * 0.1)),
          volume: Math.round(proximityWeight * (20000 + rand() * 200000)),
        },
      });
    }

    return rows;
  }
}

export const mockMarketDataProvider = new MockMarketDataProvider();

// Single swap point for a live provider later.
export const activeProvider: MarketDataProvider = mockMarketDataProvider;
