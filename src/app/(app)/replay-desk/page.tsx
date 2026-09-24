"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Play, Pause, RotateCcw, Calendar, Clock } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InstrumentSymbol } from "@/components/instrument-symbol";
import { CandlestickChart } from "@/components/trading/candlestick-chart";
import { PreTradeModal, type PreTradeSubmit } from "@/components/trading/pre-trade-modal";
import { replaySessionCandles } from "@/lib/candles";
import type { Side, Emotion } from "@/lib/trade-store";
import { cn } from "@/lib/utils";

const sessions = [
  { id: "18-sep-nifty", instrument: "NIFTY", date: "18 Sep 2026", time: "09:30 AM", description: "Gap-up open with early trend reversal" },
  { id: "02-sep-bank-nifty", instrument: "BANK NIFTY", date: "02 Sep 2026", time: "10:15 AM", description: "Range-bound session with a late breakout" },
  { id: "21-aug-sensex", instrument: "SENSEX", date: "21 Aug 2026", time: "02:00 PM", description: "High-volatility event-driven afternoon" },
] as const;

type ReplayTrade = {
  id: string;
  side: Side;
  quantity: number;
  entryPrice: number;
  exitPrice: number;
  stopLoss: number;
  target: number;
  thesis: string;
  emotion: Emotion;
  pnl: number;
};

const speeds = [1, 2, 4] as const;

function formatInr(n: number) {
  const sign = n >= 0 ? "+" : "-";
  return `${sign}₹${Math.abs(Math.round(n)).toLocaleString("en-IN")}`;
}

export default function ReplayDeskPage() {
  const [sessionId, setSessionId] = useState<(typeof sessions)[number]["id"] | null>(null);
  const [cursor, setCursor] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<(typeof speeds)[number]>(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [openPosition, setOpenPosition] = useState<{ side: Side; quantity: number; entryPrice: number; stopLoss: number; target: number; thesis: string; emotion: Emotion } | null>(null);
  const [trades, setTrades] = useState<ReplayTrade[]>([]);
  const [ended, setEnded] = useState(false);

  const session = sessions.find((s) => s.id === sessionId) ?? null;
  const fullCandles = useMemo(
    () => (sessionId ? replaySessionCandles[sessionId] : []),
    [sessionId],
  );
  const visibleCandles = useMemo(() => fullCandles.slice(0, Math.max(cursor, 4)), [fullCandles, cursor]);
  const currentPrice = visibleCandles[visibleCandles.length - 1]?.close ?? 0;

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!playing || !session) return;
    intervalRef.current = setInterval(() => {
      setCursor((c) => {
        if (c >= fullCandles.length) {
          setPlaying(false);
          return c;
        }
        return c + 1;
      });
    }, 700 / speed);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [playing, speed, session, fullCandles.length]);

  function startSession(id: (typeof sessions)[number]["id"]) {
    setSessionId(id);
    setCursor(4);
    setPlaying(false);
    setTrades([]);
    setOpenPosition(null);
    setEnded(false);
  }

  function handleSubmitTrade(values: PreTradeSubmit) {
    setOpenPosition({ ...values, entryPrice: currentPrice });
    setModalOpen(false);
    toast.success(`${values.side} ${values.quantity} ${session?.instrument} opened`, {
      description: `Entry ${currentPrice.toFixed(2)} · SL ${values.stopLoss} · Target ${values.target}`,
    });
  }

  function closeReplayPosition() {
    if (!openPosition) return;
    const direction = openPosition.side === "BUY" ? 1 : -1;
    const pnl = (currentPrice - openPosition.entryPrice) * openPosition.quantity * direction;
    setTrades((prev) => [
      ...prev,
      {
        id: `${Date.now()}`,
        side: openPosition.side,
        quantity: openPosition.quantity,
        entryPrice: openPosition.entryPrice,
        exitPrice: currentPrice,
        stopLoss: openPosition.stopLoss,
        target: openPosition.target,
        thesis: openPosition.thesis,
        emotion: openPosition.emotion,
        pnl,
      },
    ]);
    setOpenPosition(null);
    toast(pnl >= 0 ? "Trade closed in profit" : "Trade closed in loss", {
      description: `${pnl >= 0 ? "+" : "-"}₹${Math.abs(Math.round(pnl)).toLocaleString("en-IN")} realized`,
    });
  }

  const netPnl = trades.reduce((s, t) => s + t.pnl, 0);
  const progress = fullCandles.length > 0 ? Math.round((cursor / fullCandles.length) * 100) : 0;

  if (!session) {
    return (
      <div className="p-5 sm:p-8">
        <h1 className="text-2xl font-semibold tracking-tight">Market Replay</h1>
        <p className="mt-1 max-w-xl text-sm text-muted">
          Choose a historical session. You&apos;ll only see what was knowable at each
          moment — no hindsight.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {sessions.map((s) => (
            <Card key={s.id} className="flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs text-muted-2">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {s.date}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {s.time}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <InstrumentSymbol instrument={s.instrument} />
                <p className="font-mono text-sm font-medium">{s.instrument}</p>
              </div>
              <p className="text-sm leading-relaxed text-muted">{s.description}</p>
              <Button size="sm" className="mt-1" onClick={() => startSession(s.id)}>
                <Play className="h-3.5 w-3.5" />
                Start replay
              </Button>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (ended) {
    const wins = trades.filter((t) => t.pnl > 0).length;
    const winRate = trades.length ? Math.round((wins / trades.length) * 100) : 0;
    const maxDrawdown = trades.reduce((min, t) => Math.min(min, t.pnl), 0);
    const ruleViolations = trades.filter(
      (t) => (t.side === "BUY" && t.exitPrice < t.stopLoss) || (t.side === "SELL" && t.exitPrice > t.stopLoss),
    ).length;

    const scorecard = [
      { label: "Trades taken", value: trades.length.toString() },
      { label: "Win rate", value: `${winRate}%` },
      { label: "Net P&L", value: formatInr(netPnl) },
      { label: "Max single loss", value: formatInr(maxDrawdown) },
      { label: "Rule violations", value: ruleViolations.toString() },
      { label: "Instrument", value: session.instrument },
    ];

    return (
      <div className="p-5 sm:p-8">
        <h1 className="text-2xl font-semibold tracking-tight">Replay scorecard</h1>
        <p className="mt-1 text-sm text-muted">
          {session.date} &middot; {session.instrument}
        </p>

        <Card className="mt-6 grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-3">
          {scorecard.map((item) => (
            <div key={item.label}>
              <p className="text-xs text-muted-2">{item.label}</p>
              <p className="mt-1.5 font-mono text-lg font-semibold">{item.value}</p>
            </div>
          ))}
        </Card>

        <div className="mt-6 flex gap-3">
          <Button variant="secondary" onClick={() => startSession(session.id)}>
            <RotateCcw className="h-4 w-4" />
            Replay again
          </Button>
          <Button variant="ghost" onClick={() => setSessionId(null)}>
            Choose another session
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Market Replay</h1>
          <p className="mt-1 text-sm text-muted">
            {session.date} &middot; {session.time} &middot; {session.instrument}
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            setPlaying(false);
            setEnded(true);
          }}
        >
          End replay
        </Button>
      </div>

      <Card className="mt-6 p-0">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border p-5">
          <div className="flex items-center gap-3">
            <InstrumentSymbol instrument={session.instrument} />
            <span className="font-mono text-2xl font-semibold tracking-tight">
              {currentPrice.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
            </span>
            {openPosition && (
              <Badge tone={openPosition.side === "BUY" ? "positive" : "negative"}>
                {openPosition.side} {openPosition.quantity}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setPlaying((p) => !p)}
              disabled={cursor >= fullCandles.length}
            >
              {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              {playing ? "Pause" : "Play"}
            </Button>
            {speeds.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSpeed(s)}
                className={cn(
                  "h-9 cursor-pointer rounded-[var(--radius-sm)] px-2.5 text-xs font-medium transition-colors",
                  speed === s ? "bg-primary/10 text-primary" : "text-muted-2 hover:text-foreground",
                )}
              >
                {s}x
              </button>
            ))}
            {openPosition ? (
              <Button size="sm" variant="secondary" onClick={closeReplayPosition}>
                Close position
              </Button>
            ) : (
              <Button size="sm" onClick={() => setModalOpen(true)}>
                New Trade
              </Button>
            )}
          </div>
        </div>

        <div className="p-2">
          <CandlestickChart data={visibleCandles} height={380} />
        </div>

        <div className="border-t border-border px-5 py-3">
          <input
            type="range"
            min={4}
            max={fullCandles.length}
            value={cursor}
            onChange={(e) => setCursor(Number(e.target.value))}
            className="w-full accent-primary"
          />
          <p className="mt-1 text-xs text-muted-2">{progress}% through session</p>
        </div>
      </Card>

      {trades.length > 0 && (
        <Card className="mt-5">
          <p className="text-xs uppercase tracking-wider text-muted-2">
            Trades this session &middot;{" "}
            <span className={netPnl >= 0 ? "text-positive" : "text-negative"}>{formatInr(netPnl)}</span>
          </p>
          <div className="mt-3 flex flex-col gap-2">
            {trades.map((t) => (
              <div key={t.id} className="flex items-center justify-between rounded-[var(--radius-sm)] border border-border px-3 py-2 text-sm">
                <span className="flex items-center gap-2">
                  <Badge tone={t.side === "BUY" ? "positive" : "negative"}>{t.side}</Badge>
                  <span className="text-muted-2">{t.quantity} qty</span>
                </span>
                <span className={cn("font-mono font-medium", t.pnl >= 0 ? "text-positive" : "text-negative")}>
                  {formatInr(t.pnl)}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      <PreTradeModal
        open={modalOpen}
        instrument={session.instrument}
        currentPrice={currentPrice}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmitTrade}
      />
    </div>
  );
}
