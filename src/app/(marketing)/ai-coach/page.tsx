import type { Metadata } from "next";
import { Sparkles, User } from "lucide-react";
import { PageHeader } from "@/components/marketing/page-header";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Table, TableHead, TableBody, TableRow, Th, Td } from "@/components/ui/table";
import { InstrumentSymbol } from "@/components/instrument-symbol";
import { mistakeLibrary, journalTrades } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "AI Coach — Trenvora",
  description:
    "An AI trading coach that analyzes your own trades, journal, and behavioural history — evidence-based answers, never invented statistics.",
};

const conversation = [
  {
    role: "user" as const,
    text: "Why did I lose today?",
  },
  {
    role: "coach" as const,
    text: "Today you took 4 trades and closed net -₹1,240. Two of the four were entered more than 2 minutes after your signal — both were late entries into extended moves. Your largest loss (-₹960 on BANK NIFTY 51,500 PE) also carried 1.8x your average position size.",
  },
  {
    role: "user" as const,
    text: "What mistakes am I repeating?",
  },
  {
    role: "coach" as const,
    text: "Early Exit is your most common pattern this month — 17 trades, averaging an exit 11 minutes before your stated target. It shows up most between 9:15–9:45 AM, when volatility is highest.",
  },
];

export default function AiCoachPage() {
  return (
    <>
      <PageHeader
        eyebrow="AI Coach"
        title="Evidence-based analysis of your own trading."
        description="The Coach only sees your trades, journal, risk, and history — it never invents a statistic. Ask it what happened, and it answers with your own data."
      />

      <section className="py-16 sm:py-20">
        <Container className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <Card className="border-border-strong bg-surface/60">
            <div className="flex flex-col gap-5">
              {conversation.map((message, i) => (
                <div
                  key={i}
                  className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse text-right" : ""}`}
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      message.role === "coach"
                        ? "bg-intelligence/15 text-intelligence"
                        : "bg-surface-2 text-muted"
                    }`}
                  >
                    {message.role === "coach" ? (
                      <Sparkles className="h-4 w-4" />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </div>
                  <div
                    className={`max-w-md rounded-[var(--radius-md)] px-4 py-3 text-sm leading-relaxed ${
                      message.role === "coach"
                        ? "bg-surface-2 text-foreground"
                        : "bg-primary/10 text-foreground"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Mistake Library
            </h2>
            <p className="mt-2 text-sm text-muted">
              The Coach classifies recurring behavioural patterns automatically.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              {mistakeLibrary.map((mistake) => (
                <div
                  key={mistake.name}
                  className="rounded-[var(--radius-md)] border border-border bg-surface px-4 py-3.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{mistake.name}</span>
                    <span className="font-mono text-sm text-muted-2">
                      {mistake.count} trades
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-2">
                    {mistake.insight}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-border py-16 sm:py-20">
        <Container>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            What the Coach sees
          </h2>
          <p className="mt-2 max-w-xl text-muted">
            The same structured trade data behind every answer — nothing
            hidden, nothing invented.
          </p>

          <Table className="mt-8">
            <TableHead>
              <TableRow>
                <Th>Instrument</Th>
                <Th>Date</Th>
                <Th className="text-right">Entry</Th>
                <Th className="text-right">Exit</Th>
                <Th className="text-right">Qty</Th>
                <Th className="text-right">P&amp;L</Th>
              </TableRow>
            </TableHead>
            <TableBody>
              {journalTrades.map((trade) => (
                <TableRow key={`${trade.instrument}-${trade.date}-${trade.entry}`}>
                  <Td className="flex items-center gap-2.5 font-medium">
                    <InstrumentSymbol instrument={trade.instrument} />
                    {trade.instrument}
                  </Td>
                  <Td className="text-muted">{trade.date}</Td>
                  <Td className="text-right font-mono">{trade.entry}</Td>
                  <Td className="text-right font-mono">{trade.exit}</Td>
                  <Td className="text-right font-mono">{trade.qty}</Td>
                  <Td
                    className={`text-right font-mono font-medium ${
                      trade.pnl >= 0 ? "text-positive" : "text-negative"
                    }`}
                  >
                    {trade.pnl >= 0 ? "+" : "-"}₹{Math.abs(trade.pnl).toLocaleString("en-IN")}
                  </Td>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Container>
      </section>
    </>
  );
}
