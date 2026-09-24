import type { Metadata } from "next";
import {
  LineChart,
  ShieldAlert,
  Sparkles,
  History,
  Dna,
  FlaskConical,
  NotebookPen,
  Trophy,
} from "lucide-react";
import { PageHeader } from "@/components/marketing/page-header";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { InstrumentSymbol } from "@/components/instrument-symbol";
import { DnaRadarChart } from "@/components/charts/dna-radar-chart";
import { tradingDna } from "@/lib/mock-data";

const instruments = ["NIFTY", "BANK NIFTY", "SENSEX"];

export const metadata: Metadata = {
  title: "Features — Trenvora",
  description:
    "Paper trading, Trade Guard, AI Coach, Trading DNA, Market Replay, Strategy Lab, journal, and challenges — everything Trenvora uses to build trading discipline.",
};

const modules = [
  {
    icon: LineChart,
    title: "Paper Trading",
    description:
      "Simulate NIFTY, BANK NIFTY, SENSEX, equities, futures, and options with realistic order behaviour, live P&L, and a mandatory pre-trade checklist — no real money at risk.",
  },
  {
    icon: ShieldAlert,
    title: "Trade Guard",
    description:
      "Your safety net while you trade — real-time market-condition alerts for momentum shifts, volatility spikes, and unusual volume. Observations, never buy/sell instructions.",
  },
  {
    icon: Sparkles,
    title: "AI Trading Coach",
    description:
      "Reads your trade history — paper trades today, imported real trades later — to spot your mental state at entry (FOMO, revenge, calm) and tell you exactly what pattern to fix next. Grounded in your own data, never invented.",
  },
  {
    icon: History,
    title: "Market Replay",
    description:
      "Pick a date, instrument, and time, then trade the historical session candle by candle — a flight simulator for your entries, exits, and discipline.",
  },
  {
    icon: FlaskConical,
    title: "Strategy Lab",
    description:
      "Define rule-based strategies and backtest them against historical data: win rate, profit factor, drawdown, and an AI explanation of the results.",
  },
  {
    icon: NotebookPen,
    title: "Trading Journal",
    description:
      "Every trade automatically becomes a journal entry — thesis, market context, execution quality, and an AI reflection — plus manual and voice notes.",
  },
];

export default function FeaturesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Product"
        title="We analyze how you trade — not just what you traded."
        description="Every paper trade you place gets read back to you: your entries, your exits, the emotion you tagged going in, and whether you stuck to your own plan. Trenvora turns that into a clear read on your mental state under pressure and specific, evidence-based suggestions for what to change next."
      />

      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {modules.map(({ icon: Icon, title, description }) => (
              <Card
                key={title}
                className="flex flex-col gap-4 transition-all duration-200 hover:-translate-y-1 hover:border-border-strong hover:shadow-xl hover:shadow-black/20"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <div>
                  <h3 className="text-base font-medium">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {description}
                  </p>
                </div>
                {title === "Paper Trading" && (
                  <div className="mt-auto flex items-center gap-2 border-t border-border pt-4">
                    {instruments.map((instrument) => (
                      <InstrumentSymbol key={instrument} instrument={instrument} />
                    ))}
                    <span className="text-xs text-muted-2">+ equities, F&amp;O</span>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section id="trading-dna" className="scroll-mt-20 border-t border-border py-16 sm:py-20">
        <Container>
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-intelligence/10 text-intelligence">
            <Dna className="h-5 w-5" strokeWidth={1.75} />
          </div>
          <h2 className="mt-5 text-2xl font-semibold tracking-tight sm:text-3xl">
            Trading DNA
          </h2>
          <p className="mt-3 max-w-md text-muted leading-relaxed">
            A long-term behavioural profile built from your actual trades —
            not a vibe. Every score is backed by measurable evidence you can
            click into.
          </p>

          <Card className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <div className="flex-1">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border-strong px-2.5 py-1 text-xs font-medium text-muted-2">
                Example — not your data
              </span>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                This score fills in for real once you&apos;ve closed a few
                paper trades — Discipline, Risk Control, Entry &amp; Exit
                Quality, all backed by evidence you can click into, the same
                way it works here.
              </p>
            </div>
            <div className="w-full shrink-0 sm:w-56">
              <DnaRadarChart data={tradingDna.map((t) => ({ label: t.label, score: t.score }))} />
            </div>
          </Card>

          <ButtonLink href="/signup" size="md" className="mt-6">
            Build your real Trading DNA
          </ButtonLink>
        </Container>
      </section>

      <section className="border-t border-border py-16 sm:py-20">
        <Container>
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-warning/10 text-warning">
              <Trophy className="h-5 w-5" strokeWidth={1.75} />
            </div>
            <div>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Challenges
              </h2>
              <p className="mt-3 max-w-2xl text-muted leading-relaxed">
                Process-based challenges — like a 7-Day Discipline Challenge
                with a fixed risk cap, no stop-loss modification, and a
                mandatory thesis for every trade. Rewards go to process
                adherence, never to reckless P&amp;L.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
