// Illustrative market news — not a live feed. Swappable behind the same
// provider-abstraction pattern as market-data-provider.ts once a licensed
// news source is wired up.
export type NewsItem = {
  id: string;
  headline: string;
  source: string;
  time: string;
  tag: "Markets" | "Policy" | "Earnings" | "Global";
};

export const marketNews: NewsItem[] = [
  {
    id: "n1",
    headline: "NIFTY holds above 24,800 as banking stocks lead gains",
    source: "Market Desk",
    time: "2h ago",
    tag: "Markets",
  },
  {
    id: "n2",
    headline: "RBI keeps repo rate unchanged, signals cautious outlook for FY27",
    source: "Policy Wire",
    time: "5h ago",
    tag: "Policy",
  },
  {
    id: "n3",
    headline: "Bank Nifty volatility rises ahead of weekly options expiry",
    source: "Derivatives Desk",
    time: "6h ago",
    tag: "Markets",
  },
  {
    id: "n4",
    headline: "IT majors set to report Q2 earnings this week — street watches margins",
    source: "Earnings Tracker",
    time: "9h ago",
    tag: "Earnings",
  },
  {
    id: "n5",
    headline: "US Fed commentary weighs on global risk sentiment overnight",
    source: "Global Markets",
    time: "12h ago",
    tag: "Global",
  },
  {
    id: "n6",
    headline: "SENSEX ends flat as FII outflows offset domestic buying",
    source: "Market Desk",
    time: "1d ago",
    tag: "Markets",
  },
];
