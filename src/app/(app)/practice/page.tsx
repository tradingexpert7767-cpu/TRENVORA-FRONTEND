"use client";

import { useEffect, useMemo, useState } from "react";
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
import { useTradeStore } from "@/lib/trade-store";
import { availableBalance as computeAvailableBalance, usedMargin, totalEquity, requiredMargin as computeRequiredMargin } from "@/lib/wallet";
import { activeProvider } from "@/lib/market-data-provider";
import { analyzeTrades } from "@/lib/behavior-analysis";
import { cn } from "@/lib/utils";

const instruments = ["NIFTY", "BANK NIFTY", "SENSEX"] as const;

const LOT_SIZE: Record<(typeof instruments)[number], number> = {
  NIFTY: 75,
  "BANK NIFTY": 30,
  SENSEX: 20,
};

type TradeTicket = {
  instrumentLabel: string;
  price: number;
  isOption: boolean;
  lotSize: number;
};

function formatInr(n: number) {
  const sign = n >= 0 ? "+" : "-";
  return `${sign}₹${Math.abs(Math.round(n)).toLocaleString("en-IN")}`;
}

export default function PracticePage() {
  const [instrument, setInstrument] = useState<(typeof instruments)[number]>("NIFTY");
  const [mode, setMode] = useState<"spot" | "options">("spot");
  const [expiryId, setExpiryId] = useState("w1");
  const [candles, setCandles] = useState<Candle[]>(() => [...liveSessionCandles.NIFTY]);
  const [candlesInstrument, setCandlesInstrument] = useState(instrument);
  const [ticket, setTicket] = useState<TradeTicket | null>(null);
  const [resetOpen, setResetOpen] = useState(false);

  const positions = useTradeStore((s) => s.positions);
  const history = useTradeStore((s) => s.history);
  const openPosition = useTradeStore((s) => s.openPosition);
  const closePosition = useTradeStore((s) => s.closePosition);
  const reset = useTradeStore((s) => s.reset);

  // Reset the candle series when the instrument changes — adjusting state
  // during render (React's recommended pattern) instead of in an effect.
  if (instrument !== candlesInstrument) {
    setCandlesInstrument(instrument);
    setCandles([...liveSessionCandles[instrument]]);
  }

  // Simulate a ticking market: nudge the last candle every few seconds.
  useEffect(() => {
    const id = setInterval(() => {
      setCandles((prev) => {
        if (prev.length === 0) return prev;
        const last = prev[prev.length - 1];
        const drift = (Math.random() - 0.48) * last.close * 0.0006;
        const close = Math.round((last.close + drift) * 100) / 100;
        const updated: Candle = {
          ...last,
          close,
          high: Math.max(last.high, close),
          low: Math.min(last.low, close),
        };
        return [...prev.slice(0, -1), updated];
      });
    }, 2500);
    return () => clearInterval(id);
  }, []);

  const currentPrice = candles[candles.length - 1]?.close ?? 0;
  const prevClose = candles[0]?.open ?? currentPrice;
  const changePct = ((currentPrice - prevClose) / prevClose) * 100;

  const openPnl = useMemo(
    () =>
      positions
        .filter((p) => p.instrument === instrument)
        .reduce((sum, p) => {
          const direction = p.side === "BUY" ? 1 : -1;
          return sum + (currentPrice - p.entryPrice) * p.quantity * direction;
        }, 0),
    [positions, instrument, currentPrice],
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
        <div className="flex flex-wrap items-center gap-2">
          {instruments.map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => setInstrument(i)}
              className={cn(
                "flex cursor-pointer items-center gap-2 rounded-[var(--radius-md)] border px-3 py-2 text-sm font-medium transition-colors",
                instrument === i
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border-strong text-muted hover:text-foreground",
              )}
            >
              <InstrumentSymbol instrument={i} className="h-5 w-5 text-[10px]" />
              {i}
            </button>
          ))}
          <div className="ml-1 flex items-center gap-1 rounded-[var(--radius-md)] border border-border-strong p-1">
            {(["spot", "options"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={cn(
                  "cursor-pointer rounded-[var(--radius-sm)] px-3 py-1.5 text-sm font-medium transition-colors",
                  mode === m ? "bg-surface-2 text-foreground" : "text-muted-2 hover:text-foreground",
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
          <div className="flex items-center justify-between border-b border-border p-5">
            <div>
              <p className="text-xs text-muted-2">{instrument} &middot; Paper</p>
              <div className="mt-1 flex items-baseline gap-2.5">
                <span className="font-mono text-2xl font-semibold tracking-tight">
                  {currentPrice.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                </span>
                <Badge tone={changePct >= 0 ? "positive" : "negative"}>
                  {changePct >= 0 ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3" />
                  )}
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
              <CandlestickChart data={candles} height={380} />
            </div>
          ) : (
            <div className="p-5">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="text-xs text-muted-2">Expiry</span>
                {expiries.map((e) => (
                  <button
                    key={e.id}
                    type="button"
                    onClick={() => setExpiryId(e.id)}
                    className={cn(
                      "cursor-pointer rounded-full border px-3 py-1 text-xs font-medium transition-colors",
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
                onSelect={(leg, strike, premium) =>
                  openTicket({
                    instrumentLabel: `${instrument} ${strike} ${leg}`,
                    price: premium,
                    isOption: true,
                    lotSize: LOT_SIZE[instrument],
                  })
                }
              />
              <p className="mt-3 text-xs text-muted-2">
                Click a premium to buy that option (long CE/PE only — writing
                options isn&apos;t supported in paper trading yet).
              </p>
            </div>
          )}
        </Card>

        <div className="flex flex-col gap-5">
          <WalletCard available={wallet.available} used={wallet.used} equity={wallet.equity} />

          <Card>
            <p className="text-xs uppercase tracking-wider text-muted-2">Session summary</p>
            <div className="mt-3 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-2">Open P&amp;L</p>
                <AnimatedNumber
                  value={openPnl}
                  format={formatInr}
                  className={cn("mt-1 block font-mono text-lg font-semibold", openPnl >= 0 ? "text-positive" : "text-negative")}
                />
              </div>
              <div>
                <p className="text-xs text-muted-2">Realized P&amp;L</p>
                <AnimatedNumber
                  value={realizedPnl}
                  format={formatInr}
                  className={cn("mt-1 block font-mono text-lg font-semibold", realizedPnl >= 0 ? "text-positive" : "text-negative")}
                />
              </div>
              <div>
                <p className="text-xs text-muted-2">Trades closed</p>
                <p className="mt-1 font-mono text-lg font-semibold">{history.length}</p>
              </div>
              <div>
                <p className="text-xs text-muted-2">Win rate</p>
                <p className="mt-1 font-mono text-lg font-semibold">
                  {winRate === null ? "—" : `${winRate}%`}
                </p>
              </div>
            </div>
            {history.length > 0 && (
              <button
                type="button"
                onClick={() => setResetOpen(true)}
                className="mt-4 flex cursor-pointer items-center gap-1.5 text-xs text-muted-2 hover:text-negative"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Reset paper account
              </button>
            )}
          </Card>

          <Card>
            <p className="text-xs uppercase tracking-wider text-muted-2">
              Open positions ({positions.length})
            </p>
            {positions.length === 0 ? (
              <p className="mt-4 text-sm text-muted-2">
                No open positions. Place a paper trade to get started.
              </p>
            ) : (
              <div className="mt-4 flex flex-col gap-3">
                <AnimatePresence initial={false}>
                  {positions.map((p) => {
                    const live = p.instrument === instrument ? currentPrice : p.entryPrice;
                    const direction = p.side === "BUY" ? 1 : -1;
                    const pnl = (live - p.entryPrice) * p.quantity * direction;
                    return (
                      <motion.div
                        key={p.id}
                        layout
                        initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                        animate={{ opacity: 1, height: "auto", marginBottom: 0 }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden rounded-[var(--radius-md)] border border-border px-3.5 py-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <InstrumentSymbol instrument={p.instrument} />
                            <span className="text-sm font-medium">{p.instrument}</span>
                            <Badge tone={p.side === "BUY" ? "positive" : "negative"}>{p.side}</Badge>
                          </div>
                          <span className={cn("font-mono text-sm font-medium", pnl >= 0 ? "text-positive" : "text-negative")}>
                            {formatInr(pnl)}
                          </span>
                        </div>
                        <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-muted-2">
                          <span>Qty {p.quantity}</span>
                          <span>Entry {p.entryPrice.toFixed(1)}</span>
                          <span>SL {p.stopLoss}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleClosePosition(p.id, live, p.side, p.quantity, p.entryPrice)}
                          className="mt-3 w-full cursor-pointer rounded-[var(--radius-sm)] border border-border-strong py-1.5 text-xs font-medium text-muted transition-colors hover:border-negative/50 hover:text-negative"
                        >
                          Close at market
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
        <p className="text-xs uppercase tracking-wider text-muted-2">Trade history</p>
        {history.length === 0 ? (
          <p className="mt-4 text-sm text-muted-2">
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
                  <Td className="flex items-center gap-2 font-medium">
                    <InstrumentSymbol instrument={t.instrument} />
                    {t.instrument}
                  </Td>
                  <Td>
                    <Badge tone={t.side === "BUY" ? "positive" : "negative"}>{t.side}</Badge>
                  </Td>
                  <Td className="text-right font-mono">{t.entryPrice.toFixed(1)}</Td>
                  <Td className="text-right font-mono">{t.exitPrice.toFixed(1)}</Td>
                  <Td className="text-right font-mono">{t.quantity}</Td>
                  <Td className="max-w-[220px] truncate whitespace-normal text-xs text-muted">
                    {t.thesis}
                  </Td>
                  <Td className={cn("text-right font-mono font-medium", t.pnl >= 0 ? "text-positive" : "text-negative")}>
                    {formatInr(t.pnl)}
                  </Td>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <PreTradeModal
        key={ticket?.instrumentLabel ?? "none"}
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
