export const equityCurve = [
  { label: "Week 1", equity: 500000 },
  { label: "Week 2", equity: 512400 },
  { label: "Week 3", equity: 508900 },
  { label: "Week 4", equity: 527600 },
  { label: "Week 5", equity: 541200 },
  { label: "Week 6", equity: 536800 },
  { label: "Week 7", equity: 558300 },
  { label: "Week 8", equity: 584250 },
];

export const alertSparklines: Record<string, number[]> = {
  NIFTY: [24580, 24650, 24610, 24780, 24700, 24812, 24760, 24870],
  "BANK NIFTY": [50900, 51340, 51100, 51680, 51450, 51820, 51700, 52140],
  SENSEX: [80600, 80850, 80500, 80910, 81050, 80700, 81180, 81450],
};

export const journalTrades = [
  { instrument: "NIFTY 25,000 CE", date: "22 Sep", entry: 145, exit: 172, qty: 75, pnl: 2025 },
  { instrument: "BANK NIFTY 51,500 PE", date: "22 Sep", entry: 210, exit: 178, qty: 30, pnl: -960 },
  { instrument: "SENSEX 81,200 CE", date: "21 Sep", entry: 88, exit: 134, qty: 60, pnl: 2760 },
  { instrument: "NIFTY 24,900 PE", date: "20 Sep", entry: 96, exit: 71, qty: 75, pnl: -1875 },
  { instrument: "NIFTY", date: "20 Sep", entry: 24680, exit: 24812, qty: 25, pnl: 3300 },
  { instrument: "BANK NIFTY 52,000 CE", date: "19 Sep", entry: 162, exit: 205, qty: 30, pnl: 1290 },
];

export const tradingDna = [
  { label: "Discipline", score: 78, evidence: "Based on 42 trades: 31 followed the pre-trade plan without deviation." },
  { label: "Risk Control", score: 71, evidence: "Average risk per trade stayed within 1.2x of your defined limit in 36 of 42 trades." },
  { label: "Entry Quality", score: 83, evidence: "34 of 42 entries occurred within your planned trigger zone." },
  { label: "Exit Quality", score: 64, evidence: "14 trades exited before target, 8 trades had a modified stop loss." },
  { label: "Consistency", score: 76, evidence: "Trade frequency stayed within your weekly plan in 9 of the last 12 weeks." },
  { label: "Patience", score: 69, evidence: "Average time-to-entry after signal: 4.2 minutes, down from 1.8 minutes last month." },
  { label: "FOMO", score: 31, evidence: "13 of 42 trades were entered more than 2 minutes after the triggering move." },
  { label: "Overtrading", score: 22, evidence: "3 days exceeded your 3-trade daily limit in the last 30 days." },
];

export const tradeGuardAlerts = [
  {
    instrument: "NIFTY",
    headline: "Momentum Weakening",
    trend: "Bullish → Neutral",
    momentum: "Weakening",
    volatility: "Increasing",
    volume: "Above average",
    detected: "10:42 AM",
    explanation: "Price momentum weakened while volatility increased.",
    severity: "warning" as const,
  },
  {
    instrument: "BANK NIFTY",
    headline: "Unusual Volume Detected",
    trend: "Bullish",
    momentum: "Strengthening",
    volatility: "Elevated",
    volume: "2.3x average",
    detected: "11:07 AM",
    explanation: "Volume surged well above the 20-period average without a matching price breakout.",
    severity: "info" as const,
  },
  {
    instrument: "SENSEX",
    headline: "Trend Reversal Conditions Detected",
    trend: "Bearish → Neutral",
    momentum: "Flattening",
    volatility: "Increasing",
    volume: "Average",
    detected: "12:15 PM",
    explanation: "Price broke above short-term resistance as momentum diverged from the prior downtrend.",
    severity: "warning" as const,
  },
];

export const mistakeLibrary = [
  { name: "FOMO", count: 23, insight: "16 of 23 FOMO trades occurred after missing an earlier move." },
  { name: "Late Entry", count: 19, insight: "Entries averaged 3.4 minutes after the signal candle closed." },
  { name: "Early Exit", count: 17, insight: "Exits landed an average of 11 minutes before the planned target." },
  { name: "Moved Stop Loss", count: 12, insight: "8 of 12 adjustments widened risk mid-trade." },
  { name: "Over-sizing", count: 9, insight: "Position size exceeded the 30-day average by 2x or more." },
  { name: "Revenge Trading", count: 6, insight: "Entered within 5 minutes of a losing trade in 6 instances." },
];

export const journalEntries = [
  {
    instrument: "NIFTY 25,000 CE",
    time: "09:42 AM",
    entry: 145,
    exit: 172,
    quantity: 75,
    pnl: 2025,
    thesis: "Breakout above previous high.",
    trend: "Bullish",
    momentum: "Strong",
    volume: "Above average",
    executionEntry: "Good",
    executionRisk: "Good",
    executionExit: "Early",
    reflection: "You exited 11 minutes before your planned target despite the original thesis remaining valid.",
  },
  {
    instrument: "BANK NIFTY 51,500 PE",
    time: "01:18 PM",
    entry: 210,
    exit: 178,
    quantity: 30,
    pnl: -960,
    thesis: "Rejection at resistance with rising IV.",
    trend: "Neutral",
    momentum: "Weak",
    volume: "Average",
    executionEntry: "Late",
    executionRisk: "Oversized",
    executionExit: "Good",
    reflection: "Position size was 1.8x your average; stop loss held but the loss was amplified by size.",
  },
];

export const strategyBacktest = {
  name: "VWAP + RSI Momentum",
  condition: "NIFTY > VWAP and RSI(14) > 55 and Volume > 20-period average",
  stopLoss: "20%",
  target: "40%",
  trades: 128,
  winRate: 58,
  profitFactor: 1.74,
  netPnl: 84250,
  maxDrawdown: -12400,
  avgTrade: 658,
  avgWin: 1840,
  avgLoss: -1120,
  riskReward: "1 : 1.6",
};

export const replaySessions = [
  { date: "18 Sep 2026", instrument: "NIFTY", time: "09:30 AM", description: "Gap-up open with early trend reversal" },
  { date: "02 Sep 2026", instrument: "BANK NIFTY", time: "10:15 AM", description: "Range-bound session with a late breakout" },
  { date: "21 Aug 2026", instrument: "SENSEX", time: "02:00 PM", description: "High-volatility event-driven afternoon" },
];

export const weeklyReport = {
  totalTrades: 27,
  winRate: 56,
  pnl: 18420,
  avgRisk: "1.1%",
  largestLoss: -3200,
  largestWin: 5400,
  processScore: 74,
  disciplineScore: 78,
  mostCommonMistake: "Early Exit",
  bestBehaviour: "Consistent position sizing",
  worstBehaviour: "Exiting before planned target under volatility",
  mostDangerousPeriod: "9:15–9:45 AM (opening volatility)",
  improvement: "+6 points vs. last week",
};

export const pricingTiers = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    description: "Start building the habit of practicing before you trade.",
    features: [
      "Unlimited paper trading (equity)",
      "Basic markets watchlist",
      "Basic trading journal",
      "Limited AI analysis (5/month)",
      "Basic Trading DNA",
      "Limited market replay (3 sessions/month)",
    ],
    cta: "Start free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "₹799",
    period: "/month",
    description: "For traders building consistency and discipline.",
    features: [
      "Everything in Free",
      "Unlimited paper trading (F&O)",
      "Advanced AI Coach",
      "Full Trading DNA",
      "Trade Guard alerts",
      "Weekly AI reports",
      "Unlimited market replay",
    ],
    cta: "Start Pro trial",
    highlighted: true,
  },
  {
    name: "Pro+",
    price: "₹1,999",
    period: "/month",
    description: "For traders backtesting and refining strategies.",
    features: [
      "Everything in Pro",
      "Strategy Lab backtesting",
      "Options Lab",
      "Unlimited AI analysis",
      "Broker / file trade import",
      "Advanced analytics",
    ],
    cta: "Start Pro+ trial",
    highlighted: false,
  },
];

export const faqs = [
  {
    question: "Is Trenvora giving me buy/sell recommendations?",
    answer:
      "No. Trenvora observes market conditions — momentum, volatility, trend, volume — and explains what changed. It never tells you what trade to take. All content is educational and behavioural, not personalized financial advice.",
  },
  {
    question: "Is this real money trading?",
    answer:
      "No. Every trade on Trenvora is simulated. Paper trading lets you practice execution, risk management, and decision-making without financial risk.",
  },
  {
    question: "Where does the AI Coach get its answers from?",
    answer:
      "The AI Coach only analyzes your own structured trade data — entries, exits, risk, thesis, and journal notes. It never invents statistics or predicts market direction.",
  },
  {
    question: "What markets can I practice with?",
    answer:
      "NIFTY, BANK NIFTY, SENSEX, equities, futures, and options (CE/PE), with more instruments planned.",
  },
  {
    question: "Can I import my real broker trades?",
    answer:
      "Pro+ supports importing completed trades from supported brokers or files, so you can compare your paper trading discipline against your real trading behaviour.",
  },
  {
    question: "Is market data here licensed for live trading decisions?",
    answer:
      "Trenvora uses a market-data abstraction layer designed for education and simulation. It is not positioned as a source for live trading execution.",
  },
];
