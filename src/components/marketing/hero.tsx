import { ArrowUpRight, ShieldAlert, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { InstrumentSymbol } from "@/components/instrument-symbol";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[560px] bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,color-mix(in_oklab,var(--color-primary)_18%,transparent),transparent)]"
      />

      <Container className="grid items-center gap-14 lg:grid-cols-2 lg:gap-10">
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            A Modern Trading Technology
          </p>

          <h1 className="mt-3 text-4xl font-semibold leading-[1.08] tracking-tight text-balance sm:text-5xl lg:text-[3.25rem]">
            Train your trading before you risk your money.
          </h1>

          <p className="mt-5 text-lg leading-relaxed text-muted text-pretty">
            Trenvora combines paper trading, market intelligence, AI-powered
            trade analysis, historical replay, and behavioural insights to
            help traders understand and improve their decision-making.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/practice" size="lg">
              Start Practicing
              <ArrowUpRight className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink href="/features" variant="secondary" size="lg">
              Explore Trenvora
            </ButtonLink>
          </div>

          <p className="mt-6 text-xs text-muted-2">
            Simulated trading environment. Educational use only — not
            investment advice.
          </p>
        </div>

        <div className="relative">
          <Card className="border-border-strong bg-surface/80 shadow-2xl shadow-black/40 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <InstrumentSymbol instrument="NIFTY" />
                <div>
                  <p className="text-xs text-muted-2">NIFTY 50 &middot; Paper</p>
                  <p className="mt-1 font-mono text-2xl font-semibold tracking-tight">
                    24,812.35
                  </p>
                </div>
              </div>
              <Badge tone="positive">
                <ArrowUpRight className="h-3 w-3" />
                +0.64%
              </Badge>
            </div>

            <svg
              viewBox="0 0 320 96"
              className="mt-5 h-24 w-full"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M0 72 L32 66 L64 70 L96 48 L128 54 L160 34 L192 40 L224 22 L256 28 L288 12 L320 18"
                fill="none"
                stroke="var(--color-positive)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M0 72 L32 66 L64 70 L96 48 L128 54 L160 34 L192 40 L224 22 L256 28 L288 12 L320 18 L320 96 L0 96 Z"
                fill="url(#heroGradient)"
                opacity="0.5"
              />
              <defs>
                <linearGradient id="heroGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-positive)" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="var(--color-positive)" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-[var(--radius-md)] border border-warning/25 bg-warning/10 p-3.5">
                <div className="flex items-center gap-1.5 text-warning">
                  <ShieldAlert className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium">Trade Guard</span>
                </div>
                <p className="mt-1.5 text-xs leading-snug text-muted">
                  Momentum weakening, volatility rising
                </p>
              </div>

              <div className="rounded-[var(--radius-md)] border border-intelligence/25 bg-intelligence/10 p-3.5">
                <div className="flex items-center gap-1.5 text-intelligence">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium">AI Coach</span>
                </div>
                <p className="mt-1.5 text-xs leading-snug text-muted">
                  Exit discipline improved 12% this week
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-[var(--radius-md)] border border-border bg-surface-2 px-3.5 py-3">
              <span className="text-xs text-muted-2">Discipline score</span>
              <span className="font-mono text-sm font-semibold text-foreground">
                78<span className="text-muted-2">/100</span>
              </span>
            </div>
          </Card>
        </div>
      </Container>
    </section>
  );
}
