import type { Position, ClosedTrade } from "@/lib/trade-store";

export const STARTING_BALANCE = 500000;

// Index instruments trade on margin, not full notional cash — roughly what
// SPAN + exposure margin comes to for NIFTY/BANK NIFTY/SENSEX futures.
export const MARGIN_RATE = 0.18;

// Buying an option is a debit trade — the full premium is paid up front,
// no leverage discount the way futures/index margin gets one.
export function requiredMargin(price: number, quantity: number, isOption = false) {
  return isOption ? price * quantity : price * quantity * MARGIN_RATE;
}

export function realizedPnl(history: ClosedTrade[]) {
  return history.reduce((sum, t) => sum + t.pnl, 0);
}

function isOptionInstrument(instrument: string) {
  return / (CE|PE)$/.test(instrument);
}

export function usedMargin(positions: Position[]) {
  return positions.reduce(
    (sum, p) => sum + requiredMargin(p.entryPrice, p.quantity, isOptionInstrument(p.instrument)),
    0,
  );
}

export function availableBalance(positions: Position[], history: ClosedTrade[]) {
  return STARTING_BALANCE + realizedPnl(history) - usedMargin(positions);
}

export function totalEquity(history: ClosedTrade[]) {
  return STARTING_BALANCE + realizedPnl(history);
}
