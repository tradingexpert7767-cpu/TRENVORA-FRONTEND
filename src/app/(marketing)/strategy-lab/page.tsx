import type { Metadata } from "next";
import { PageHeader } from "@/components/marketing/page-header";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { EquityCurveChart } from "@/components/charts/equity-curve-chart";
import { strategyBacktest, equityCurve } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Strategy Lab — Trenvora",
  description:
    "Build rule-based strategies and backtest them against historical data — win rate, profit factor, drawdown, and an AI explanation of the results.",
};

const metrics = [
  { label: "Trades", value: strategyBacktest.trades.toString() },
  { label: "Win rate", value: `${strategyBacktest.winRate}%` },
  { label: "Profit factor", value: strategyBacktest.profitFactor.toFixed(2) },
  { label: "Net P&L", value: `₹${strategyBacktest.netPnl.toLocaleString("en-IN")}` },
  { label: "Max drawdown", value: `-₹${Math.abs(strategyBacktest.maxDrawdown).toLocaleString("en-IN")}` },
  { label: "Average trade", value: `₹${strategyBacktest.avgTrade.toLocaleString("en-IN")}` },
  { label: "Average win", value: `₹${strategyBacktest.avgWin.toLocaleString("en-IN")}` },
  { label: "Average loss", value: `-₹${Math.abs(strategyBacktest.avgLoss).toLocaleString("en-IN")}` },
];

export default function StrategyLabPage() {
  return (
    <>
      <PageHeader
        eyebrow="Strategy Lab"
        title="Turn a hypothesis into a tested strategy."
        description="Define entry and exit conditions, backtest against historical data, and let the AI explain what actually drove the results — not just the numbers."
      />

      <section className="border-b border-border py-16 sm:py-20">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-2">
                Equity curve
              </p>
              <h2 className="mt-1 text-lg font-medium">{strategyBacktest.name}</h2>
            </div>
            <span className="font-mono text-sm font-medium text-positive">
              +₹{strategyBacktest.netPnl.toLocaleString("en-IN")}
            </span>
          </div>
          <Card className="mt-5">
            <EquityCurveChart data={equityCurve} />
          </Card>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <Card>
            <p className="text-xs uppercase tracking-wider text-muted-2">
              Strategy definition
            </p>
            <h2 className="mt-2 text-lg font-medium">{strategyBacktest.name}</h2>

            <pre className="mt-5 overflow-x-auto rounded-[var(--radius-md)] border border-border bg-surface-2 p-4 font-mono text-xs leading-relaxed text-muted">
{`IF
  ${strategyBacktest.condition.replace(/ and /g, "\n  AND ")}
THEN
  ENTER

Stop Loss: ${strategyBacktest.stopLoss}
Target: ${strategyBacktest.target}`}
            </pre>

            <button
              type="button"
              className="mt-5 inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-[var(--radius-md)] bg-primary text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Backtest strategy
            </button>
          </Card>

          <div>
            <p className="text-xs uppercase tracking-wider text-muted-2">
              Backtest results
            </p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              {metrics.map((metric) => (
                <Card key={metric.label} className="p-4">
                  <p className="text-xs text-muted-2">{metric.label}</p>
                  <p className="mt-1.5 font-mono text-lg font-semibold">
                    {metric.value}
                  </p>
                </Card>
              ))}
            </div>

            <Card className="mt-4 border-intelligence/20 bg-intelligence/5">
              <p className="text-xs font-medium text-intelligence">
                AI explanation
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                This strategy performed best in trending sessions with
                above-average volume, and produced its largest drawdown during
                range-bound afternoons — consider adding a volatility filter
                to reduce false signals in low-momentum conditions.
              </p>
            </Card>
          </div>
        </Container>
      </section>
    </>
  );
}
