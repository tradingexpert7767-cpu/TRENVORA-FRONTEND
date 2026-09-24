"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Side = "BUY" | "SELL";
export type Emotion = "Calm" | "Confident" | "Fearful" | "FOMO" | "Revenge" | "Uncertain";

export type Position = {
  id: string;
  instrument: string;
  side: Side;
  quantity: number;
  entryPrice: number;
  stopLoss: number;
  target: number;
  thesis: string;
  emotion: Emotion;
  openedAt: number;
};

export type ClosedTrade = Position & {
  exitPrice: number;
  closedAt: number;
  pnl: number;
};

type TradeState = {
  positions: Position[];
  history: ClosedTrade[];
  openPosition: (position: Omit<Position, "id" | "openedAt">) => void;
  closePosition: (id: string, exitPrice: number) => void;
  reset: () => void;
};

function pnlFor(position: Position, exitPrice: number) {
  const direction = position.side === "BUY" ? 1 : -1;
  return Math.round((exitPrice - position.entryPrice) * position.quantity * direction);
}

export const useTradeStore = create<TradeState>()(
  persist(
    (set, get) => ({
      positions: [],
      history: [],
      openPosition: (position) => {
        const newPosition: Position = {
          ...position,
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          openedAt: Date.now(),
        };
        set({ positions: [newPosition, ...get().positions] });
      },
      closePosition: (id, exitPrice) => {
        const position = get().positions.find((p) => p.id === id);
        if (!position) return;
        const closed: ClosedTrade = {
          ...position,
          exitPrice,
          closedAt: Date.now(),
          pnl: pnlFor(position, exitPrice),
        };
        set({
          positions: get().positions.filter((p) => p.id !== id),
          history: [closed, ...get().history],
        });
      },
      reset: () => set({ positions: [], history: [] }),
    }),
    { name: "trenvora-paper-trades" },
  ),
);
