import type { Metadata } from "next";
import Link from "next/link";
import { Play, Calendar, Clock } from "lucide-react";
import { PageHeader } from "@/components/marketing/page-header";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { InstrumentSymbol } from "@/components/instrument-symbol";
import { Sparkline } from "@/components/charts/sparkline";
import { replaySessions, alertSparklines } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Market Replay — Trenvora",
  description:
    "Replay historical market sessions candle by candle, trade the moment blind to what comes next, and get a replay scorecard on entry, exit, and discipline.",
};

const scorecard = [
  { label: "Entry quality", value: "82/100" },
  { label: "Exit quality", value: "58/100" },
  { label: "Risk management", value: "74/100" },
  { label: "Discipline", value: "69/100" },
  { label: "Process score", value: "71/100" },
  { label: "P&L", value: "+₹3,140" },
  { label: "Max drawdown", value: "-₹1,050" },
  { label: "Rule violations", value: "1" },
];

export default function ReplayPage() {
  return (
    <>
      <PageHeader
        eyebrow="Market Replay"
        title="A flight simulator for your trading."
        description="Choose a date, instrument, and time. Trenvora replays the session candle by candle, showing you only what was knowable at that moment — no hindsight."
      />

      <section className="py-16 sm:py-20">
        <Container>
          <h2 className="text-xl font-semibold tracking-tight">Choose a session</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {replaySessions.map((session) => (
              <Card key={session.date} className="flex flex-col gap-3">
                <div className="flex items-center justify-between text-xs text-muted-2">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {session.date}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {session.time}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <InstrumentSymbol instrument={session.instrument} />
                    <p className="font-mono text-sm font-medium">{session.instrument}</p>
                  </div>
                  <Sparkline data={alertSparklines[session.instrument] ?? []} tone="intelligence" />
                </div>
                <p className="text-sm leading-relaxed text-muted">
                  {session.description}
                </p>
                <Link
                  href="/replay-desk"
                  className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                >
                  <Play className="h-3.5 w-3.5" />
                  Start replay
                </Link>
              </Card>
            ))}
          </div>

          <ButtonLink href="/replay-desk" variant="secondary" size="md" className="mt-8">
            Open the replay desk
          </ButtonLink>
        </Container>
      </section>

      <section className="border-t border-border py-16 sm:py-20">
        <Container>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Replay scorecard
          </h2>
          <p className="mt-2 max-w-xl text-muted">
            Every session ends with a breakdown of how you actually traded it —
            not just whether you made money.
          </p>

          <Card className="mt-8 grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4">
            {scorecard.map((item) => (
              <div key={item.label}>
                <p className="text-xs text-muted-2">{item.label}</p>
                <p className="mt-1.5 font-mono text-lg font-semibold">
                  {item.value}
                </p>
              </div>
            ))}
          </Card>
        </Container>
      </section>
    </>
  );
}
