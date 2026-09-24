import type { ClosedTrade, Emotion } from "@/lib/trade-store";

export type Insight = {
  id: string;
  tone: "positive" | "warning" | "negative" | "intelligence";
  title: string;
  detail: string;
  action: string;
};

export type BehaviorReport = {
  hasEnoughData: boolean;
  disciplineScore: number;
  stats: {
    totalTrades: number;
    winRate: number;
    avgWin: number;
    avgLoss: number;
    profitFactor: number | null;
  };
  insights: Insight[];
};

const MIN_TRADES = 3;
const OVERTRADE_DAILY_LIMIT = 3;
const IMPULSIVE_EMOTIONS: Emotion[] = ["FOMO", "Revenge"];
const TENSE_EMOTIONS: Emotion[] = ["FOMO", "Revenge", "Fearful", "Uncertain"];

// Used by the emotion timeline: every emotion resolves to one of two
// states so "calm vs high-tension" reads as a clear pattern over time.
export function emotionState(emotion: Emotion): "calm" | "tense" {
  return TENSE_EMOTIONS.includes(emotion) ? "tense" : "calm";
}

function dayKey(ts: number) {
  return new Date(ts).toDateString();
}

// Every score adjustment and insight below is derived directly from the
// trades passed in — nothing here is invented or estimated.
export function analyzeTrades(history: ClosedTrade[]): BehaviorReport {
  const totalTrades = history.length;

  if (totalTrades < MIN_TRADES) {
    return {
      hasEnoughData: false,
      disciplineScore: 0,
      stats: { totalTrades, winRate: 0, avgWin: 0, avgLoss: 0, profitFactor: null },
      insights: [
        {
          id: "not-enough-data",
          tone: "intelligence",
          title: "Not enough trades yet",
          detail: `Close at least ${MIN_TRADES} paper trades to unlock behavioural analysis. You've closed ${totalTrades} so far.`,
          action: `Place ${MIN_TRADES - totalTrades} more paper trade${MIN_TRADES - totalTrades === 1 ? "" : "s"} on the Practice desk — each one uses the pre-trade checklist, which is what this analysis reads from.`,
        },
      ],
    };
  }

  const wins = history.filter((t) => t.pnl > 0);
  const losses = history.filter((t) => t.pnl < 0);
  const winRate = Math.round((wins.length / totalTrades) * 100);
  const avgWin = wins.length ? wins.reduce((s, t) => s + t.pnl, 0) / wins.length : 0;
  const avgLoss = losses.length ? losses.reduce((s, t) => s + t.pnl, 0) / losses.length : 0;
  const grossWin = wins.reduce((s, t) => s + t.pnl, 0);
  const grossLoss = Math.abs(losses.reduce((s, t) => s + t.pnl, 0));
  const profitFactor = grossLoss > 0 ? grossWin / grossLoss : null;

  const insights: Insight[] = [];
  let score = 60;

  // Win rate
  if (winRate >= 55) {
    score += 12;
    insights.push({
      id: "win-rate",
      tone: "positive",
      title: `${winRate}% win rate across ${totalTrades} trades`,
      detail: `${wins.length} winners, ${losses.length} losers. Average win ${formatInr(avgWin)} vs average loss ${formatInr(avgLoss)}.`,
      action: "Keep doing what you're doing — the process is working. Don't change entry criteria just because a recent trade lost.",
    });
  } else if (winRate < 40) {
    score -= 10;
    insights.push({
      id: "win-rate",
      tone: "warning",
      title: `${winRate}% win rate across ${totalTrades} trades`,
      detail: `${losses.length} of ${totalTrades} trades closed at a loss. Average loss ${formatInr(avgLoss)} vs average win ${formatInr(avgWin)}.`,
      action: "Review your last 5 losing trades in the journal — look for a shared setup or emotion tag before changing anything else.",
    });
  }

  // Overtrading — group by day
  const byDay = new Map<string, number>();
  for (const t of history) {
    const key = dayKey(t.closedAt);
    byDay.set(key, (byDay.get(key) ?? 0) + 1);
  }
  const worstDay = [...byDay.entries()].sort((a, b) => b[1] - a[1])[0];
  if (worstDay && worstDay[1] > OVERTRADE_DAILY_LIMIT) {
    score -= 12;
    insights.push({
      id: "overtrading",
      tone: "negative",
      title: "Overtrading detected",
      detail: `You took ${worstDay[1]} trades on ${worstDay[0]} — above a healthy ${OVERTRADE_DAILY_LIMIT}-trade daily pace. High-frequency days often correlate with lower-quality entries.`,
      action: `Set a hard cap of ${OVERTRADE_DAILY_LIMIT} trades a day and stop once you hit it, win or lose — the 7-Day Discipline Challenge enforces exactly this.`,
    });
  }

  // Emotion correlation
  const impulsive = history.filter((t) => IMPULSIVE_EMOTIONS.includes(t.emotion));
  const calm = history.filter((t) => !IMPULSIVE_EMOTIONS.includes(t.emotion));
  if (impulsive.length >= 2) {
    const impulsiveWinRate = Math.round(
      (impulsive.filter((t) => t.pnl > 0).length / impulsive.length) * 100,
    );
    const calmWinRate = calm.length
      ? Math.round((calm.filter((t) => t.pnl > 0).length / calm.length) * 100)
      : null;
    if (calmWinRate !== null && impulsiveWinRate < calmWinRate) {
      score -= 14;
      insights.push({
        id: "emotion",
        tone: "negative",
        title: "FOMO and revenge trades underperform your calm entries",
        detail: `${impulsive.length} trades tagged FOMO/Revenge won ${impulsiveWinRate}% of the time, vs ${calmWinRate}% for trades entered Calm or Confident.`,
        action: "When you catch yourself entering on FOMO or right after a loss, wait 5 minutes and re-write the thesis box before confirming — that pause alone breaks most impulsive entries.",
      });
    } else {
      insights.push({
        id: "emotion",
        tone: "warning",
        title: `${impulsive.length} trades entered on FOMO or Revenge`,
        detail: `That's ${Math.round((impulsive.length / totalTrades) * 100)}% of your trades. Worth watching even though it hasn't hurt your win rate yet.`,
        action: "It hasn't cost you yet — but tag it consistently so you'll see the pattern early if it starts to.",
      });
    }
  }

  // Early exit on winners vs plan
  const winsWithTarget = wins.filter((t) => t.target !== t.entryPrice);
  const earlyExits = winsWithTarget.filter((t) => {
    const reachedTarget =
      t.side === "BUY" ? t.exitPrice >= t.target : t.exitPrice <= t.target;
    return !reachedTarget;
  });
  if (winsWithTarget.length >= 2 && earlyExits.length / winsWithTarget.length > 0.5) {
    score -= 8;
    const pct = Math.round((earlyExits.length / winsWithTarget.length) * 100);
    insights.push({
      id: "early-exit",
      tone: "warning",
      title: "Exiting winners before target",
      detail: `${earlyExits.length} of ${winsWithTarget.length} winning trades (${pct}%) closed before reaching the planned target.`,
      action: "Try trailing your stop instead of watching the ticker once you're in profit — it removes the decision to bail early without capping the upside.",
    });
  }

  // Position sizing consistency
  const sizes = history.map((t) => t.entryPrice * t.quantity);
  const avgSize = sizes.reduce((s, v) => s + v, 0) / sizes.length;
  const maxSize = Math.max(...sizes);
  if (avgSize > 0 && maxSize > avgSize * 2) {
    score -= 10;
    insights.push({
      id: "sizing",
      tone: "warning",
      title: "Inconsistent position sizing",
      detail: `Your largest position was ${(maxSize / avgSize).toFixed(1)}x your average size (${formatInr(maxSize)} vs an average of ${formatInr(avgSize)}). Sudden size increases raise risk per trade.`,
      action: "Pick one position size (or a fixed % of your wallet) for every setup with the same conviction level, and only break that rule with a written reason in the thesis box.",
    });
  } else {
    score += 6;
  }

  // Stop-loss discipline
  const stopBreaches = history.filter((t) => {
    if (t.pnl >= 0) return false;
    const breached = t.side === "BUY" ? t.exitPrice < t.stopLoss : t.exitPrice > t.stopLoss;
    return breached;
  });
  if (stopBreaches.length > 0) {
    score -= 10;
    insights.push({
      id: "stop-discipline",
      tone: "negative",
      title: "Losses exceeded the planned stop loss",
      detail: `${stopBreaches.length} losing trade${stopBreaches.length > 1 ? "s" : ""} closed beyond your stated stop loss — the actual loss was larger than planned.`,
      action: "Treat your stop loss as the exit, not a suggestion — if a trade needs a wider stop, that's a signal to size down, not to move the stop.",
    });
  }

  if (insights.length === 0) {
    insights.push({
      id: "steady",
      tone: "positive",
      title: "No major behavioural flags",
      detail: `Across ${totalTrades} trades, sizing, emotion, and exit discipline all stayed within a healthy range.`,
      action: "Nothing to fix right now — keep journaling every trade so this stays true as your sample size grows.",
    });
  }

  return {
    hasEnoughData: true,
    disciplineScore: Math.max(0, Math.min(100, Math.round(score))),
    stats: { totalTrades, winRate, avgWin, avgLoss, profitFactor },
    insights,
  };
}

function formatInr(n: number) {
  const sign = n >= 0 ? "+" : "-";
  return `${sign}₹${Math.abs(Math.round(n)).toLocaleString("en-IN")}`;
}
