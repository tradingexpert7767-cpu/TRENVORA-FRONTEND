"use client";

import { useMemo } from "react";
import { AlertTriangle, CheckCircle2, Info, Lightbulb, Sparkles, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Table, TableHead, TableBody, TableRow, Th, Td } from "@/components/ui/table";
import { InstrumentSymbol } from "@/components/instrument-symbol";
import { ScoreRing } from "@/components/trading/score-ring";
import { EmotionTimeline } from "@/components/trading/emotion-timeline";
import { useTradeStore } from "@/lib/trade-store";
import { analyzeTrades, type Insight } from "@/lib/behavior-analysis";
import { cn } from "@/lib/utils";

const toneIcon: Record<Insight["tone"], typeof CheckCircle2> = {
  positive: CheckCircle2,
  warning: AlertTriangle,
  negative: AlertTriangle,
  intelligence: Info,
};

function formatInr(n: number) {
  const sign = n >= 0 ? "+" : "-";
  return `${sign}₹${Math.abs(Math.round(n)).toLocaleString("en-IN")}`;
}

export default function InsightsPage() {
  const history = useTradeStore((s) => s.history);
  const report = useMemo(() => analyzeTrades(history), [history]);

  if (!report.hasEnoughData) {
    return (
      <div className="p-5 sm:p-8">
        <h1 className="text-2xl font-semibold tracking-tight">Your Trading DNA</h1>
        <p className="mt-1 max-w-md text-sm text-muted">
          A behavioural profile built entirely from your own paper trades — no
          generic advice, no invented statistics.
        </p>

        <Card className="mt-8 flex flex-col items-center gap-4 py-14 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-intelligence/10 text-intelligence">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="font-medium">{report.insights[0].title}</p>
            <p className="mt-1.5 max-w-xs text-sm text-muted">{report.insights[0].detail}</p>
            <p className="mt-1.5 max-w-xs text-sm text-muted-2">{report.insights[0].action}</p>
          </div>
          <ButtonLink href="/practice" size="sm">
            Start practicing
          </ButtonLink>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-5 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Your Trading DNA</h1>
          <p className="mt-1 max-w-md text-sm text-muted">
            Computed from {report.stats.totalTrades} closed paper trades stored on this device.
          </p>
        </div>
        <ButtonLink href="/practice" variant="secondary" size="sm">
          Back to Practice
        </ButtonLink>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[auto_1fr]">
        <Card className="flex flex-col items-center justify-center gap-3 text-center">
          <ScoreRing score={report.disciplineScore} />
          <p className="text-xs uppercase tracking-wider text-muted-2">Discipline score</p>
        </Card>

        <Card>
          <p className="text-xs uppercase tracking-wider text-muted-2">Performance</p>
          <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <p className="text-xs text-muted-2">Trades closed</p>
              <p className="mt-1 font-mono text-lg font-semibold">{report.stats.totalTrades}</p>
            </div>
            <div>
              <p className="text-xs text-muted-2">Win rate</p>
              <p className="mt-1 font-mono text-lg font-semibold">{report.stats.winRate}%</p>
            </div>
            <div>
              <p className="text-xs text-muted-2">Avg win</p>
              <p className="mt-1 font-mono text-lg font-semibold text-positive">
                {formatInr(report.stats.avgWin)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-2">Avg loss</p>
              <p className="mt-1 font-mono text-lg font-semibold text-negative">
                {formatInr(report.stats.avgLoss)}
              </p>
            </div>
          </div>
          {report.stats.profitFactor !== null && (
            <div className="mt-4 flex items-center gap-2 border-t border-border pt-4 text-sm text-muted">
              <TrendingUp className="h-4 w-4 text-muted-2" />
              Profit factor{" "}
              <span className="font-mono font-medium text-foreground">
                {report.stats.profitFactor.toFixed(2)}
              </span>
            </div>
          )}
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold tracking-tight">Emotional state over time</h2>
        <p className="mt-1 text-sm text-muted">
          Every trade is tagged with how you felt entering it — this is where calm and
          high-tension trades show up, in order.
        </p>
        <Card className="mt-4">
          <EmotionTimeline history={history} />
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold tracking-tight">Behavioural insights</h2>
        <p className="mt-1 text-sm text-muted">
          Every observation below is backed by trades you can click into.
        </p>

        <div className="mt-4 flex flex-col gap-3">
          {report.insights.map((insight) => {
            const Icon = toneIcon[insight.tone];
            return (
              <Card
                key={insight.id}
                className={cn(
                  "flex items-start gap-3",
                  insight.tone === "positive" && "border-positive/25",
                  insight.tone === "warning" && "border-warning/25",
                  insight.tone === "negative" && "border-negative/25",
                  insight.tone === "intelligence" && "border-intelligence/25",
                )}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                    insight.tone === "positive" && "bg-positive/10 text-positive",
                    insight.tone === "warning" && "bg-warning/10 text-warning",
                    insight.tone === "negative" && "bg-negative/10 text-negative",
                    insight.tone === "intelligence" && "bg-intelligence/10 text-intelligence",
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">{insight.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{insight.detail}</p>
                  <div className="mt-2.5 flex items-start gap-1.5 rounded-[var(--radius-sm)] bg-surface-2 px-3 py-2">
                    <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                    <p className="text-xs leading-relaxed text-muted">
                      <span className="font-medium text-foreground">How to improve: </span>
                      {insight.action}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold tracking-tight">Evidence</h2>
        <p className="mt-1 text-sm text-muted">The trades behind every insight above.</p>

        <Table className="mt-4">
          <TableHead>
            <TableRow>
              <Th>Instrument</Th>
              <Th>Side</Th>
              <Th>Emotion</Th>
              <Th className="text-right">Entry</Th>
              <Th className="text-right">Exit</Th>
              <Th className="text-right">P&amp;L</Th>
            </TableRow>
          </TableHead>
          <TableBody>
            {history.map((t) => (
              <TableRow key={t.id}>
                <Td className="flex items-center gap-2 font-medium">
                  <InstrumentSymbol instrument={t.instrument} />
                  {t.instrument}
                </Td>
                <Td>
                  <Badge tone={t.side === "BUY" ? "positive" : "negative"}>{t.side}</Badge>
                </Td>
                <Td className="text-muted">{t.emotion}</Td>
                <Td className="text-right font-mono">{t.entryPrice.toFixed(1)}</Td>
                <Td className="text-right font-mono">{t.exitPrice.toFixed(1)}</Td>
                <Td className={cn("text-right font-mono font-medium", t.pnl >= 0 ? "text-positive" : "text-negative")}>
                  {formatInr(t.pnl)}
                </Td>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
