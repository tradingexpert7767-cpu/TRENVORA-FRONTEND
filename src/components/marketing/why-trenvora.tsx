import { ShieldAlert, Sparkles, LineChart } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";

const reasons = [
  {
    icon: LineChart,
    title: "Practice first, risk nothing",
    body: "Most traders lose money learning with real capital. Trenvora gives you a full paper trading desk — equity, futures, and options — so the tuition is free.",
  },
  {
    icon: ShieldAlert,
    title: "Observations, never instructions",
    body: "Trade Guard tells you what changed in the market — momentum, volatility, volume. It never tells you what to buy or sell. That call stays yours.",
  },
  {
    icon: Sparkles,
    title: "Evidence, not generic advice",
    body: "Your AI Coach and Trading DNA score are built entirely from your own trades. No invented statistics, no one-size-fits-all tips.",
  },
];

export function WhyTrenvora() {
  return (
    <section className="border-y border-border py-20 sm:py-28">
      <Container>
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Why traders practice with Trenvora
          </h2>
          <p className="mt-3 text-lg text-muted text-pretty">
            Most traders remember their P&amp;L. They forget their behaviour.
            Trenvora fixes that.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-3">
          {reasons.map(({ icon: Icon, title, body }) => (
            <Card key={title} className="flex flex-col gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-primary/10 text-primary">
                <Icon className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <div>
                <h3 className="text-base font-medium">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
