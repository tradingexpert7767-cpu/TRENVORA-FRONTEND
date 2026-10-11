import { ArrowDownRight, ArrowUpRight, ShieldAlert, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { InstrumentSymbol } from "@/components/instrument-symbol";
import { CandlestickChart } from "@/components/trading/candlestick-chart";
import { MarketBeast } from "@/components/marketing/market-beast";
import { liveSessionCandles } from "@/lib/candles";
import { TickerStrip } from "@/components/marketing/ticker-strip";

// The preview card's quote is read from the same candles the chart draws,
// so the headline price and change always match the chart.
const sessionCandles = liveSessionCandles.NIFTY;
const lastClose = sessionCandles[sessionCandles.length - 1].close;
const sessionOpen = sessionCandles[0].open;
const changePct = ((lastClose - sessionOpen) / sessionOpen) * 100;

export function Hero() {
  const up = changePct >= 0;
  return (
    <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[560px] bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,color-mix(in_oklab,var(--color-primary)_16%,transparent),transparent)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-foreground) 1px, transparent 1px), linear-gradient(90deg, var(--color-foreground) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <Container className="grid items-center gap-14 lg:grid-cols-2 lg:gap-10">
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            Paper Trading Platform
          </span>

          <h1 className="mt-4 text-4xl font-semibold leading-[1.08] tracking-tight text-balance sm:text-5xl lg:text-[3.25rem]">
            Train your <span className="text-primary">trading</span> before
            you risk your money.
          </h1>

          <p className="mt-4 text-sm font-medium uppercase tracking-[0.12em] text-muted-2">
            Practice. Analyze. Improve.
          </p>

          <p className="mt-3 text-lg leading-relaxed text-muted text-pretty">
            Trenvora combines paper trading, market intelligence, AI-powered
            trade analysis, historical replay, and behavioural insights to
            help traders understand and improve their decision-making.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/signup" size="lg" className="group">
              Start Practicing
              <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </ButtonLink>
            <ButtonLink href="/features" variant="secondary" size="lg">
              Explore Trenvora
            </ButtonLink>
          </div>

          <p className="mt-6 flex items-center gap-1.5 text-xs text-muted-2">
            <ShieldAlert className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            Simulated trading environment. Educational use only — not
            investment advice.
          </p>
        </div>

        <div className="relative">
          <MarketBeast
            kind="bull"
            className="pointer-events-none absolute -bottom-4 left-0 hidden h-32 w-36 opacity-70 lg:block"
          />
          <MarketBeast
            kind="bear"
            className="pointer-events-none absolute -bottom-4 right-0 hidden h-32 w-36 opacity-70 lg:block"
          />

          <Card className="relative border-border-strong bg-surface/90 shadow-2xl shadow-black/40 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <InstrumentSymbol instrument="NIFTY" />
                <div>
                  <p className="text-xs text-muted">NIFTY 50 &middot; Paper</p>
                  <p className="mt-1 font-mono text-2xl font-semibold tracking-tight tabular-nums">
                    {lastClose.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
              <Badge tone={up ? "positive" : "negative"}>
                {up ? (
                  <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                ) : (
                  <ArrowDownRight className="h-3 w-3" aria-hidden="true" />
                )}
                {up ? "+" : ""}
                {changePct.toFixed(2)}%
              </Badge>
            </div>

            {/* Static caption rather than fake timeframe tabs that look clickable. */}
            <p className="mt-4 text-xs text-muted">Today &middot; 3-min candles &middot; simulated data</p>

            <div className="mt-2 -mx-2">
              <CandlestickChart
                data={liveSessionCandles.NIFTY}
                height={140}
                label="Sample NIFTY intraday candlestick chart"
              />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-[var(--radius-md)] border border-warning/25 bg-warning/10 p-3.5">
                <div className="flex items-center gap-1.5 text-warning">
                  <ShieldAlert className="h-3.5 w-3.5" aria-hidden="true" />
                  <span className="text-xs font-medium">Trade Guard</span>
                </div>
                <p className="mt-1.5 text-xs leading-snug text-muted">
                  Momentum weakening, volatility rising
                </p>
              </div>

              <div className="rounded-[var(--radius-md)] border border-intelligence/25 bg-intelligence/10 p-3.5">
                <div className="flex items-center gap-1.5 text-intelligence">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  <span className="text-xs font-medium">AI Coach</span>
                </div>
                <p className="mt-1.5 text-xs leading-snug text-muted">
                  Exit discipline improved 12% this week
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-[var(--radius-md)] border border-border bg-surface-2 px-3.5 py-3">
              <span className="text-xs text-muted">Discipline score</span>
              <span className="font-mono text-sm font-semibold tabular-nums text-foreground">
                78<span className="text-muted">/100</span>
              </span>
            </div>
          </Card>
        </div>
      </Container>

      <Container>
        <TickerStrip />
      </Container>
    </section>
  );
}
