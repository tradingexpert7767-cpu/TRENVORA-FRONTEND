"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, Trash2, Sparkles, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableHead, TableBody, TableRow, Th, Td } from "@/components/ui/table";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { InstrumentSymbol } from "@/components/instrument-symbol";
import { CandlestickChart } from "@/components/trading/candlestick-chart";
import { WalletCard } from "@/components/trading/wallet-card";
import { OptionChain } from "@/components/trading/option-chain";
import { PreTradeModal, type PreTradeSubmit } from "@/components/trading/pre-trade-modal";
import { liveSessionCandles, type Candle } from "@/lib/candles";
import { useTradeStore, type OptionContract, type Position } from "@/lib/trade-store";
import { availableBalance as computeAvailableBalance, usedMargin, totalEquity, requiredMargin as computeRequiredMargin } from "@/lib/wallet";
import { activeProvider } from "@/lib/market-data-provider";
import { analyzeTrades } from "@/lib/behavior-analysis";
import { cn } from "@/lib/utils";
import { useHydrated } from "@/hooks/use-hydrated";

const instruments = ["NIFTY", "BANK NIFTY", "SENSEX"] as const;

const LOT_SIZE: Record<(typeof instruments)[number], number> = {
  NIFTY: 75,
  "BANK NIFTY": 30,
  SENSEX: 20,
};

type Instrument = (typeof instruments)[number];

type TradeTicket = {
  instrumentLabel: string;
  price: number;
  isOption: boolean;
  lotSize: number;
  option?: OptionContract;
};

const lastClose = (i: Instrument) => liveSessionCandles[i][liveSessionCandles[i].length - 1].close;

function initialMarks(): Record<Instrument, number> {
  return { NIFTY: lastClose("NIFTY"), "BANK NIFTY": lastClose("BANK NIFTY"), SENSEX: lastClose("SENSEX") };
}

function isInstrument(s: string): s is Instrument {
  return (instruments as readonly string[]).includes(s);
}

// Positions opened before contracts were stored on the position only have
// the "NIFTY 24700 CE" label to go on.
function contractFor(p: Position): OptionContract | null {
  if (p.option) return p.option;
  const m = p.instrument.match(/^(.*) (\d+) (CE|PE)$/);
  if (!m || !isInstrument(m[1])) return null;
  return { underlying: m[1], strike: Number(m[2]), leg: m[3] as "CE" | "PE", expiryId: "w1" };
}

function formatInr(n: number) {
  const sign = n >= 0 ? "+" : "-";
  return `${sign}₹${Math.abs(Math.round(n)).toLocaleString("en-IN")}`;
}

export default function PracticePage() {
  const [instrument, setInstrument] = useState<Instrument>("NIFTY");
  const [mode, setMode] = useState<"spot" | "options">("spot");
  const [expiryId, setExpiryId] = useState("w1");
  const [ticket, setTicket] = useState<TradeTicket | null>(null);
  // Bumped on every open so the modal remounts fresh, but stays stable while
  // it closes so the exit animation can play.
  const [ticketKey, setTicketKey] = useState(0);
  const [resetOpen, setResetOpen] = useState(false);
  // Last traded price for every underlying, so positions in instruments
  // that aren't on screen keep marking to market.
  const [marks, setMarks] = useState(initialMarks);

  // Trades are persisted in localStorage; until hydration finishes, render
  // the same empty state the server did.
  const hydrated = useHydrated();
  const storedPositions = useTradeStore((s) => s.positions);
  const storedHistory = useTradeStore((s) => s.history);
  const positions = useMemo(() => (hydrated ? storedPositions : []), [hydrated, storedPositions]);
  const history = useMemo(() => (hydrated ? storedHistory : []), [hydrated, storedHistory]);
  const openPosition = useTradeStore((s) => s.openPosition);
  const closePosition = useTradeStore((s) => s.closePosition);
  const reset = useTradeStore((s) => s.reset);

  // Simulate a ticking market: every underlying drifts every few seconds.
  useEffect(() => {
    const id = setInterval(() => {
      setMarks((prev) => {
        const next = { ...prev };
        for (const i of instruments) {
          const drift = (Math.random() - 0.48) * prev[i] * 0.0006;
          next[i] = Math.round((prev[i] + drift) * 100) / 100;
        }
        return next;
      });
    }, 2500);
    return () => clearInterval(id);
  }, []);

  // The chart is the session's candles with the last one following the
  // instrument's live mark.
  const candles = useMemo<Candle[]>(() => {
    const session = liveSessionCandles[instrument];
    const last = session[session.length - 1];
    const mark = marks[instrument];
    return [
      ...session.slice(0, -1),
      { ...last, close: mark, high: Math.max(last.high, mark), low: Math.min(last.low, mark) },
    ];
  }, [instrument, marks]);

  const currentPrice = candles[candles.length - 1]?.close ?? 0;
  const sessionOpen = candles[0]?.open ?? currentPrice;
  const changePct = ((currentPrice - sessionOpen) / sessionOpen) * 100;

  // Live mark for any position: spot from the underlying's mark, options
  // re-priced off the chain at the underlying's mark.
  const markFor = useCallback(
    (p: Position) => {
      const contract = contractFor(p);
      if (contract && isInstrument(contract.underlying)) {
        return activeProvider.getOptionPremium(
          contract.underlying,
          contract.expiryId,
          marks[contract.underlying],
          contract.strike,
          contract.leg,
        );
      }
      return isInstrument(p.instrument) ? marks[p.instrument] : p.entryPrice;
    },
    [marks],
  );

  const openPnl = useMemo(
    () =>
      positions.reduce((sum, p) => {
        const direction = p.side === "BUY" ? 1 : -1;
        return sum + (markFor(p) - p.entryPrice) * p.quantity * direction;
      }, 0),
    [positions, markFor],
  );

  const realizedPnl = useMemo(() => history.reduce((sum, t) => sum + t.pnl, 0), [history]);
  const winRate =
    history.length > 0
      ? Math.round((history.filter((t) => t.pnl > 0).length / history.length) * 100)
      : null;

  const wallet = useMemo(
    () => ({
      available: computeAvailableBalance(positions, history),
      used: usedMargin(positions),
      equity: totalEquity(history),
    }),
    [positions, history],
  );

  const behavior = useMemo(() => analyzeTrades(history), [history]);
  const topInsight = behavior.insights[0];

  const expiries = useMemo(() => activeProvider.getExpiries(instrument), [instrument]);
  const optionChain = useMemo(
    () => activeProvider.getOptionChain(instrument, expiryId, currentPrice),
    [instrument, expiryId, currentPrice],
  );

  function openTicket(t: TradeTicket) {
    setTicketKey((k) => k + 1);
    setTicket(t);
  }

  function handleSubmitTrade(values: PreTradeSubmit) {
    if (!ticket) return;
    const margin = computeRequiredMargin(ticket.price, values.quantity, ticket.isOption);
    if (margin > wallet.available) {
      toast.error("Not enough available balance", {
        description: `This position needs ₹${margin.toLocaleString("en-IN")} ${ticket.isOption ? "premium" : "margin"}, you have ₹${wallet.available.toLocaleString("en-IN")} available.`,
      });
      return;
    }
    openPosition({
      instrument: ticket.instrumentLabel,
      entryPrice: ticket.price,
      ...(ticket.option ? { option: ticket.option } : {}),
      ...values,
    });
    setTicket(null);
    toast.success(`${values.side} ${values.quantity} ${ticket.instrumentLabel} opened`, {
      description: `Entry ${ticket.price.toFixed(2)} · SL ${values.stopLoss} · Target ${values.target}`,
    });
  }

  function handleClosePosition(id: string, exitPrice: number, side: string, qty: number, entryPrice: number) {
    const direction = side === "BUY" ? 1 : -1;
    const pnl = (exitPrice - entryPrice) * qty * direction;
    closePosition(id, exitPrice);
    toast(pnl >= 0 ? "Trade closed in profit" : "Trade closed in loss", {
      description: `${formatInr(pnl)} realized`,
    });
  }

  function handleReset() {
    reset();
    setResetOpen(false);
    toast("Paper account reset", { description: "All positions and trade history cleared." });
  }

  return (
    <div className="p-5 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Practice</h1>
          <p className="mt-1 text-sm text-muted">
            Simulated paper trading — no real capital at risk.
          </p>
        </div>
        {/* Phones: two full-width segmented rows so the chart stays near the top. */}
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
          <div role="radiogroup" aria-label="Instrument" className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:items-center">
          {instruments.map((i) => (
            <button
              key={i}
              type="button"
              role="radio"
              aria-checked={instrument === i}
              onClick={() => setInstrument(i)}
              className={cn(
                "flex min-h-11 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-md)] border px-2 py-2 text-sm font-medium transition-colors sm:px-3",
                instrument === i
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border-strong text-muted hover:text-foreground",
              )}
            >
              <InstrumentSymbol instrument={i} className="hidden h-5 w-5 sm:inline-flex" />
              {i}
            </button>
          ))}
          </div>
          <div
            role="radiogroup"
            aria-label="Trading mode"
            className="grid grid-cols-2 gap-1 rounded-[var(--radius-md)] border border-border-strong p-1 sm:flex sm:items-center"
          >
            {(["spot", "options"] as const).map((m) => (
              <button
                key={m}
                type="button"
                role="radio"
                aria-checked={mode === m}
                onClick={() => setMode(m)}
                className={cn(
                  "min-h-9 cursor-pointer rounded-[var(--radius-sm)] px-3 text-sm font-medium transition-colors",
                  mode === m ? "bg-surface-2 text-foreground" : "text-muted hover:text-foreground",
                )}
              >
                {m === "spot" ? "Spot" : "Options"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[1fr_320px]">
        <Card className="p-0">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5">
            <div>
              <p className="text-xs text-muted">{instrument} &middot; Paper</p>
              <div className="mt-1 flex items-baseline gap-2.5">
                <span className="font-mono text-2xl font-semibold tracking-tight tabular-nums" aria-live="off">
                  {currentPrice.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                </span>
                <Badge tone={changePct >= 0 ? "positive" : "negative"}>
                  {changePct >= 0 ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3" />
                  )}
                  {changePct >= 0 ? "+" : ""}
                  {changePct.toFixed(2)}%
                </Badge>
              </div>
            </div>
            {mode === "spot" && (
              <Button
                onClick={() =>
                  openTicket({ instrumentLabel: instrument, price: currentPrice, isOption: false, lotSize: 1 })
                }
              >
                New Trade
              </Button>
            )}
          </div>

          {mode === "spot" ? (
            <div className="p-2">
              <CandlestickChart data={candles} height={380} label={`${instrument} intraday candlestick chart, last ${currentPrice.toFixed(2)}`} />
            </div>
          ) : (
            <div className="p-5">
              <div role="radiogroup" aria-label="Expiry" className="mb-4 flex flex-wrap items-center gap-2">
                <span className="text-xs text-muted" aria-hidden="true">Expiry</span>
                {expiries.map((e) => (
                  <button
                    key={e.id}
                    type="button"
                    role="radio"
                    aria-checked={expiryId === e.id}
                    onClick={() => setExpiryId(e.id)}
                    className={cn(
                      "min-h-9 cursor-pointer rounded-full border px-3.5 text-xs font-medium transition-colors",
                      expiryId === e.id
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border-strong text-muted hover:text-foreground",
                    )}
                  >
                    {e.label}
                  </button>
                ))}
              </div>
              <OptionChain
                rows={optionChain}
                spot={currentPrice}
                instrument={instrument}
                onSelect={(leg, strike, premium) =>
                  openTicket({
                    instrumentLabel: `${instrument} ${strike} ${leg}`,
                    price: premium,
                    isOption: true,
                    lotSize: LOT_SIZE[instrument],
                    option: { underlying: instrument, strike, leg, expiryId },
                  })
                }
              />
              <p className="mt-3 text-xs text-muted">
                Select a premium to buy that option (long CE/PE only — writing
                options isn&apos;t supported in paper trading yet).
              </p>
            </div>
          )}
        </Card>

        <div className="flex flex-col gap-5">
          <WalletCard available={wallet.available} used={wallet.used} equity={wallet.equity} />

          <Card>
            <h2 className="text-xs font-medium uppercase tracking-wider text-muted">Session summary</h2>
            <div className="mt-3 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted">Open P&amp;L (all positions)</p>
                <AnimatedNumber
                  value={openPnl}
                  format={formatInr}
                  className={cn("mt-1 block font-mono text-lg font-semibold", openPnl >= 0 ? "text-positive" : "text-negative")}
                />
              </div>
              <div>
                <p className="text-xs text-muted">Realized P&amp;L</p>
                <AnimatedNumber
                  value={realizedPnl}
                  format={formatInr}
                  className={cn("mt-1 block font-mono text-lg font-semibold", realizedPnl >= 0 ? "text-positive" : "text-negative")}
                />
              </div>
              <div>
                <p className="text-xs text-muted">Trades closed</p>
                <p className="mt-1 font-mono text-lg font-semibold">{history.length}</p>
              </div>
              <div>
                <p className="text-xs text-muted">Win rate</p>
                <p className="mt-1 font-mono text-lg font-semibold">
                  {winRate === null ? "—" : `${winRate}%`}
                </p>
              </div>
            </div>
            {history.length > 0 && (
              <button
                type="button"
                onClick={() => setResetOpen(true)}
                className="-mx-2 mt-3 flex min-h-10 cursor-pointer items-center gap-1.5 rounded-[var(--radius-sm)] px-2 text-xs text-muted transition-colors hover:bg-negative/10 hover:text-negative"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                Reset paper account
              </button>
            )}
          </Card>

          <Card>
            <h2 className="text-xs font-medium uppercase tracking-wider text-muted">
              Open positions ({positions.length})
            </h2>
            {positions.length === 0 ? (
              <p className="mt-4 text-sm text-muted">
                No open positions. Place a paper trade to get started.
              </p>
            ) : (
              <div className="mt-4 flex flex-col gap-3">
                <AnimatePresence initial={false}>
                  {positions.map((p) => {
                    const live = markFor(p);
                    const direction = p.side === "BUY" ? 1 : -1;
                    const pnl = (live - p.entryPrice) * p.quantity * direction;
                    return (
                      <motion.div
                        key={p.id}
                        layout="position"
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="rounded-[var(--radius-md)] border border-border px-3.5 py-3"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex min-w-0 flex-wrap items-center gap-2">
                            <InstrumentSymbol instrument={p.instrument} />
                            <span className="text-sm font-medium">{p.instrument}</span>
                            <Badge tone={p.side === "BUY" ? "positive" : "negative"}>{p.side}</Badge>
                          </div>
                          <span className={cn("shrink-0 font-mono text-sm font-medium tabular-nums", pnl >= 0 ? "text-positive" : "text-negative")}>
                            {formatInr(pnl)}
                          </span>
                        </div>
                        <div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1 text-xs text-muted tabular-nums sm:grid-cols-4">
                          <span>Qty {p.quantity}</span>
                          <span>Entry {p.entryPrice.toFixed(2)}</span>
                          <span>LTP {live.toFixed(2)}</span>
                          <span>SL {p.stopLoss}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleClosePosition(p.id, live, p.side, p.quantity, p.entryPrice)}
                          className="mt-3 min-h-10 w-full cursor-pointer rounded-[var(--radius-sm)] border border-border-strong text-sm font-medium text-muted transition-colors hover:border-negative/50 hover:text-negative"
                        >
                          Close at {live.toFixed(2)}
                        </button>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </Card>

          <Link href="/insights" className="block">
            <Card
              className={cn(
                "border-intelligence/25 bg-intelligence/5 transition-all duration-200 hover:-translate-y-0.5 hover:border-intelligence/40",
              )}
            >
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-intelligence/15 text-intelligence">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{topInsight.title}</p>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted">
                    {topInsight.detail}
                  </p>
                  <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-intelligence">
                    View your Trading DNA
                    <ChevronRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </div>

      <Card className="mt-5">
        <h2 className="text-xs font-medium uppercase tracking-wider text-muted">Trade history</h2>
        {history.length === 0 ? (
          <p className="mt-4 text-sm text-muted">
            Closed trades will appear here, stored locally on this device.
          </p>
        ) : (
          <Table className="mt-4">
            <TableHead>
              <TableRow>
                <Th>Instrument</Th>
                <Th>Side</Th>
                <Th className="text-right">Entry</Th>
                <Th className="text-right">Exit</Th>
                <Th className="text-right">Qty</Th>
                <Th>Thesis</Th>
                <Th className="text-right">P&amp;L</Th>
              </TableRow>
            </TableHead>
            <TableBody>
              {history.map((t) => (
                <TableRow key={t.id}>
                  <Td className="font-medium">
                    <span className="flex items-center gap-2">
                      <InstrumentSymbol instrument={t.instrument} />
                      {t.instrument}
                    </span>
                  </Td>
                  <Td>
                    <Badge tone={t.side === "BUY" ? "positive" : "negative"}>{t.side}</Badge>
                  </Td>
                  <Td className="text-right font-mono tabular-nums">{t.entryPrice.toFixed(2)}</Td>
                  <Td className="text-right font-mono tabular-nums">{t.exitPrice.toFixed(2)}</Td>
                  <Td className="text-right font-mono tabular-nums">{t.quantity}</Td>
                  <Td className="min-w-[200px] max-w-[280px] whitespace-normal text-xs text-muted">
                    <span className="line-clamp-2" title={t.thesis}>
                      {t.thesis}
                    </span>
                  </Td>
                  <Td className={cn("text-right font-mono font-medium tabular-nums", t.pnl >= 0 ? "text-positive" : "text-negative")}>
                    {formatInr(t.pnl)}
                  </Td>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <PreTradeModal
        key={ticketKey}
        open={ticket !== null}
        instrument={ticket?.instrumentLabel ?? instrument}
        currentPrice={ticket?.price ?? currentPrice}
        availableBalance={wallet.available}
        forceSide={ticket?.isOption ? "BUY" : undefined}
        isOption={ticket?.isOption}
        lotSize={ticket?.lotSize}
        onClose={() => setTicket(null)}
        onSubmit={handleSubmitTrade}
      />

      <ConfirmDialog
        open={resetOpen}
        title="Reset paper account?"
        description="This permanently clears every open position and closed trade stored on this device. This can't be undone."
        confirmLabel="Reset account"
        danger
        onConfirm={handleReset}
        onCancel={() => setResetOpen(false)}
      />
    </div>
  );
}
