"use client";

import { ShieldAlert, Sparkles, LineChart } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
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

const dnaMetrics = [
  { label: "Risk control", value: 82 },
  { label: "Exit discipline", value: 74 },
  { label: "Consistency", value: 86 },
];

const guardRows = [
  { label: "Momentum", tone: "positive" as const, width: 62 },
  { label: "Volatility", tone: "warning" as const, width: 78 },
  { label: "Volume", tone: "intelligence" as const, width: 45 },
];

function PracticeMini() {
  return (
    <div className="rounded-[var(--radius-md)] border border-border bg-surface-2 p-3">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium uppercase tracking-wide text-primary">
          Paper Trade
        </span>
        <span className="font-mono text-xs font-semibold text-foreground">
          ₹5,00,000
        </span>
      </div>
      <svg viewBox="0 0 120 32" className="mt-2 h-8 w-full" preserveAspectRatio="none" aria-hidden="true">
        <path
          d="M0 24 L20 20 L40 22 L60 12 L80 15 L100 6 L120 9"
          fill="none"
          stroke="var(--color-positive)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function GuardMini() {
  return (
    <div className="rounded-[var(--radius-md)] border border-border bg-surface-2 p-3">
      <div className="space-y-2">
        {guardRows.map((row) => (
          <div key={row.label} className="flex items-center gap-2">
            <span className="w-20 text-xs text-muted">{row.label}</span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${row.width}%`,
                  backgroundColor: `var(--color-${row.tone})`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DnaMini() {
  const reduceMotion = useReducedMotion();
  return (
    <div className="rounded-[var(--radius-md)] border border-border bg-surface-2 p-3">
      <div className="space-y-2">
        {dnaMetrics.map((metric) => (
          <div key={metric.label} className="flex items-center gap-2">
            <span className="w-28 text-xs text-muted">{metric.label}</span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface">
              <motion.div
                className="h-full rounded-full bg-intelligence"
                initial={reduceMotion ? { width: `${metric.value}%` } : { width: 0 }}
                whileInView={{ width: `${metric.value}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
            <span className="w-9 text-right font-mono text-xs tabular-nums text-muted">{metric.value}%</span>
          </div>
        ))}
      </div>
      <p className="mt-2 text-xs text-muted">Illustrative example — not your data</p>
    </div>
  );
}

const minis = [PracticeMini, GuardMini, DnaMini];

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
          {reasons.map(({ icon: Icon, title, body }, index) => {
            const Mini = minis[index];
            return (
              <Card key={title} className="flex flex-col gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-base font-medium">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
                </div>
                <Mini />
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
