"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apiFetch } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";

export type Side = "BUY" | "SELL";
export type Emotion = "Calm" | "Confident" | "Fearful" | "FOMO" | "Revenge" | "Uncertain";

export type OptionContract = {
  underlying: string;
  strike: number;
  leg: "CE" | "PE";
  expiryId: string;
};

export type Position = {
  id: string;
  instrument: string;
  option?: OptionContract;
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
  synced: boolean;
  openPosition: (position: Omit<Position, "id" | "openedAt">) => Promise<void>;
  closePosition: (id: string, exitPrice: number) => Promise<void>;
  reset: () => Promise<void>;
  syncFromBackend: () => Promise<void>;
};

// NIFTY → NIFTY, BANK NIFTY → BANK_NIFTY
function toBackendInstrument(instrument: string) {
  return instrument.replace(/ /g, "_").toUpperCase();
}

function pnlFor(position: Position, exitPrice: number) {
  const direction = position.side === "BUY" ? 1 : -1;
  return Math.round((exitPrice - position.entryPrice) * position.quantity * direction);
}

function authHeaders(): Record<string, string> {
  const token = useAuthStore.getState().token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function isLoggedIn() {
  return Boolean(useAuthStore.getState().token);
}

function backendTradeToPosition(t: Record<string, unknown>): Position {
  const instrument = String(t.instrument ?? "").replace(/_/g, " ");
  return {
    id: String(t.id),
    instrument,
    side: t.side as Side,
    quantity: Number(t.quantity),
    entryPrice: Number(t.entryPrice),
    stopLoss: Number(t.stopLoss ?? 0),
    target: Number(t.target ?? 0),
    thesis: String(t.thesis ?? ""),
    emotion: (t.emotion as Emotion) ?? "Calm",
    openedAt: new Date(String(t.openedAt)).getTime(),
    option: t.optionType
      ? {
          underlying: instrument,
          strike: Number(t.strike),
          leg: t.optionType as "CE" | "PE",
          expiryId: String(t.expiry ?? ""),
        }
      : undefined,
  };
}

function backendTradeToClosedTrade(t: Record<string, unknown>): ClosedTrade {
  return {
    ...backendTradeToPosition(t),
    exitPrice: Number(t.exitPrice),
    closedAt: new Date(String(t.closedAt ?? t.updatedAt)).getTime(),
    pnl: Number(t.pnl ?? 0),
  };
}

export const useTradeStore = create<TradeState>()(
  persist(
    (set, get) => ({
      positions: [],
      history: [],
      synced: false,

      openPosition: async (position) => {
        if (!isLoggedIn()) {
          const newPosition: Position = {
            ...position,
            id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            openedAt: Date.now(),
          };
          set({ positions: [newPosition, ...get().positions] });
          return;
        }

        const body: Record<string, unknown> = {
          instrument: toBackendInstrument(position.instrument),
          instrumentType: position.option ? "OPTION" : "SPOT",
          side: position.side,
          quantity: position.quantity,
          entryPrice: position.entryPrice,
          stopLoss: position.stopLoss || undefined,
          target: position.target || undefined,
          thesis: position.thesis || undefined,
          emotion: position.emotion,
          optionType: position.option?.leg,
          strike: position.option?.strike,
          expiry: position.option?.expiryId,
        };

        const created = await apiFetch<Record<string, unknown>>("/trades", {
          method: "POST",
          body: JSON.stringify(body),
          headers: authHeaders(),
        });

        const newPosition = backendTradeToPosition(created);
        set({ positions: [newPosition, ...get().positions] });
      },

      closePosition: async (id, exitPrice) => {
        const position = get().positions.find((p) => p.id === id);
        if (!position) return;

        const closed: ClosedTrade = {
          ...position,
          exitPrice,
          closedAt: Date.now(),
          pnl: pnlFor(position, exitPrice),
        };

        // Optimistic update
        set({
          positions: get().positions.filter((p) => p.id !== id),
          history: [closed, ...get().history],
        });

        if (isLoggedIn() && !id.startsWith("local-")) {
          try {
            await apiFetch(`/trades/${id}/close`, {
              method: "PATCH",
              body: JSON.stringify({ exitPrice }),
              headers: authHeaders(),
            });
          } catch {
            // Already updated locally; backend will catch up on next sync
          }
        }
      },

      reset: async () => {
        set({ positions: [], history: [] });
        if (isLoggedIn()) {
          try {
            await apiFetch("/trades/reset", { method: "DELETE", headers: authHeaders() });
          } catch {
            // Local state already cleared
          }
        }
      },

      syncFromBackend: async () => {
        if (!isLoggedIn()) return;
        try {
          const all = await apiFetch<Record<string, unknown>[]>("/trades", {
            headers: authHeaders(),
          });
          const positions = (all as Record<string, unknown>[])
            .filter((t) => t.status === "OPEN")
            .map(backendTradeToPosition);
          const history = (all as Record<string, unknown>[])
            .filter((t) => t.status === "CLOSED")
            .map(backendTradeToClosedTrade);
          set({ positions, history, synced: true });
        } catch {
          // Offline — keep localStorage data
        }
      },
    }),
    { name: "trenvora-paper-trades" },
  ),
);
