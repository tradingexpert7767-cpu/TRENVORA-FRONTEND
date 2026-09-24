import type { Metadata } from "next";
import { ShieldAlert, TrendingUp, Activity, BarChart3 } from "lucide-react";
import { PageHeader } from "@/components/marketing/page-header";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InstrumentSymbol } from "@/components/instrument-symbol";
import { Sparkline } from "@/components/charts/sparkline";
import { tradeGuardAlerts, alertSparklines } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Trade Guard — Trenvora",
  description:
    "Real-time market-condition alerts for momentum, volatility, and volume. Trade Guard observes what changed — it never tells you what to trade.",
};

const principles = [
  {
    icon: TrendingUp,
    title: "What changed?",
    body: "Trend, momentum, volatility, and volume are tracked continuously against their recent baseline.",
  },
  {
    icon: Activity,
    title: "Why does it matter?",
    body: "Every alert explains the underlying shift in plain language — never a prediction of what happens next.",
  },
  {
    icon: BarChart3,
    title: "How strong is the change?",
    body: "Alerts are graded by magnitude, so a minor fluctuation never reads the same as a real regime shift.",
  },
];

export default function TradeGuardPage() {
  return (
    <>
      <PageHeader
        eyebrow="Trade Guard"
        title="Market-condition alerts, not trade calls."
        description="Trade Guard watches momentum, volatility, volume, and breadth, and tells you what changed. It never says “buy” or “sell” — that decision, and the responsibility for it, stays with you."
      />

      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-5 sm:grid-cols-3">
            {principles.map(({ icon: Icon, title, body }) => (
              <Card key={title}>
                <Icon className="h-5 w-5 text-warning" strokeWidth={1.75} />
                <h3 className="mt-4 text-sm font-medium">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-border py-16 sm:py-20">
        <Container>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Live alert feed
          </h2>
          <p className="mt-2 max-w-xl text-muted">
            A sample of the kind of observation Trade Guard surfaces during a
            session.
          </p>

          <div className="mt-8 flex flex-col gap-4">
            {tradeGuardAlerts.map((alert) => (
              <Card key={alert.headline} className="border-border-strong">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <InstrumentSymbol instrument={alert.instrument} className="mt-0.5" />
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge tone={alert.severity === "warning" ? "warning" : "intelligence"}>
                          <ShieldAlert className="h-3.5 w-3.5" />
                          {alert.instrument}
                        </Badge>
                        <span className="text-xs text-muted-2">
                          Detected {alert.detected}
                        </span>
                      </div>
                      <h3 className="mt-3 text-lg font-medium">{alert.headline}</h3>
                      <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-muted">
                        &ldquo;What changed?&rdquo; {alert.explanation}
                      </p>
                    </div>
                  </div>
                  <Sparkline
                    data={alertSparklines[alert.instrument] ?? []}
                    tone={alert.severity === "warning" ? "warning" : "intelligence"}
                  />
                </div>

                <div className="mt-5 grid grid-cols-2 gap-4 border-t border-border pt-5 sm:grid-cols-4">
                  <div>
                    <p className="text-xs text-muted-2">Trend</p>
                    <p className="mt-1 text-sm font-medium">{alert.trend}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-2">Momentum</p>
                    <p className="mt-1 text-sm font-medium">{alert.momentum}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-2">Volatility</p>
                    <p className="mt-1 text-sm font-medium">{alert.volatility}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-2">Volume</p>
                    <p className="mt-1 text-sm font-medium">{alert.volume}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
