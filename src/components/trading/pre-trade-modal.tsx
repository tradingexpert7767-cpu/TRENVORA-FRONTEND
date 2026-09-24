"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Emotion, Side } from "@/lib/trade-store";
import { requiredMargin as computeRequiredMargin } from "@/lib/wallet";

const emotions: Emotion[] = ["Calm", "Confident", "Fearful", "FOMO", "Revenge", "Uncertain"];

export type PreTradeSubmit = {
  side: Side;
  quantity: number;
  stopLoss: number;
  target: number;
  thesis: string;
  emotion: Emotion;
};

export function PreTradeModal({
  open,
  instrument,
  currentPrice,
  availableBalance,
  forceSide,
  isOption = false,
  lotSize = 1,
  onClose,
  onSubmit,
}: {
  open: boolean;
  instrument: string;
  currentPrice: number;
  availableBalance?: number;
  forceSide?: Side;
  isOption?: boolean;
  lotSize?: number;
  onClose: () => void;
  onSubmit: (values: PreTradeSubmit) => void;
}) {
  const [side, setSide] = useState<Side>(forceSide ?? "BUY");
  const [quantity, setQuantity] = useState(lotSize);
  const [stopLoss, setStopLoss] = useState(
    Math.round(currentPrice * (isOption ? 0.7 : 0.997) * 100) / 100,
  );
  const [target, setTarget] = useState(
    Math.round(currentPrice * (isOption ? 1.4 : 1.006) * 100) / 100,
  );
  const [thesis, setThesis] = useState("");
  const [emotion, setEmotion] = useState<Emotion>("Calm");

  const risk = Math.abs(currentPrice - stopLoss) * quantity;
  const reward = Math.abs(target - currentPrice) * quantity;
  const rr = risk > 0 ? (reward / risk).toFixed(2) : "—";
  const requiredMargin = computeRequiredMargin(currentPrice, quantity, isOption);
  const insufficientFunds =
    availableBalance !== undefined && requiredMargin > availableBalance;
  const canSubmit = thesis.trim().length > 0 && quantity > 0 && !insufficientFunds;

  function handleSubmit() {
    onSubmit({ side, quantity, stopLoss, target, thesis: thesis.trim(), emotion });
    setThesis("");
    setEmotion("Calm");
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[92vh] w-full overflow-y-auto rounded-t-[var(--radius-lg)] border border-border-strong bg-surface p-6 sm:max-w-lg sm:rounded-[var(--radius-lg)]"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-2">{instrument} &middot; Paper</p>
                <h2 className="mt-1 text-lg font-semibold">Why are you entering?</h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="cursor-pointer rounded-[var(--radius-sm)] p-1.5 text-muted hover:bg-surface-2 hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {forceSide ? (
              <div
                className={cn(
                  "mt-5 flex h-11 items-center justify-center rounded-[var(--radius-md)] text-sm font-medium",
                  forceSide === "BUY"
                    ? "bg-positive/15 text-positive ring-1 ring-inset ring-positive/40"
                    : "bg-negative/15 text-negative ring-1 ring-inset ring-negative/40",
                )}
              >
                {forceSide === "BUY" ? "Buy" : "Sell"} {instrument}
              </div>
            ) : (
              <div className="mt-5 grid grid-cols-2 gap-2">
                {(["BUY", "SELL"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSide(s)}
                    className={cn(
                      "h-11 cursor-pointer rounded-[var(--radius-md)] text-sm font-medium transition-colors",
                      side === s
                        ? s === "BUY"
                          ? "bg-positive/15 text-positive ring-1 ring-inset ring-positive/40"
                          : "bg-negative/15 text-negative ring-1 ring-inset ring-negative/40"
                        : "bg-surface-2 text-muted hover:text-foreground",
                    )}
                  >
                    {s === "BUY" ? "Buy / Long" : "Sell / Short"}
                  </button>
                ))}
              </div>
            )}

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="qty">{isOption ? `Quantity (lot ${lotSize})` : "Quantity"}</Label>
                <Input
                  id="qty"
                  type="number"
                  min={isOption ? lotSize : 1}
                  step={isOption ? lotSize : 1}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                />
              </div>
              <div>
                <Label>{isOption ? "Entry premium" : "Entry (market)"}</Label>
                <Input value={currentPrice.toFixed(2)} disabled className="font-mono text-muted" />
              </div>
              <div>
                <Label htmlFor="sl">Stop Loss</Label>
                <Input
                  id="sl"
                  type="number"
                  value={stopLoss}
                  onChange={(e) => setStopLoss(Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="target">Target</Label>
                <Input
                  id="target"
                  type="number"
                  value={target}
                  onChange={(e) => setTarget(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 rounded-[var(--radius-md)] border border-border bg-surface-2 px-4 py-3 text-sm">
              <div>
                <p className="text-xs text-muted-2">Risk</p>
                <p className="mt-0.5 font-mono font-medium text-negative">
                  ₹{risk.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-2">Reward : Risk</p>
                <p className="mt-0.5 font-mono font-medium">1 : {rr}</p>
              </div>
              {availableBalance !== undefined && (
                <>
                  <div>
                    <p className="text-xs text-muted-2">
                      {isOption ? "Premium payable" : "Required margin (18%)"}
                    </p>
                    <p className={cn("mt-0.5 font-mono font-medium", insufficientFunds && "text-negative")}>
                      ₹{requiredMargin.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-2">Available balance</p>
                    <p className="mt-0.5 font-mono font-medium">
                      ₹{availableBalance.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="mt-4">
              <Label htmlFor="thesis">Trade thesis — why are you entering?</Label>
              <textarea
                id="thesis"
                value={thesis}
                onChange={(e) => setThesis(e.target.value)}
                placeholder="e.g. Breakout above previous high with rising volume."
                rows={3}
                required
                className="w-full resize-none rounded-[var(--radius-md)] border border-border-strong bg-surface px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-2 outline-none transition-colors focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/40"
              />
            </div>

            <div className="mt-4">
              <Label>Emotion</Label>
              <div className="flex flex-wrap gap-2">
                {emotions.map((e) => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => setEmotion(e)}
                    className={cn(
                      "cursor-pointer rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                      emotion === e
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border-strong text-muted hover:text-foreground",
                    )}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            <Button
              type="button"
              size="lg"
              disabled={!canSubmit}
              className="mt-6 w-full"
              onClick={handleSubmit}
            >
              Confirm Paper Trade
            </Button>
            {insufficientFunds ? (
              <p className="mt-2 text-center text-xs text-negative">
                Not enough available balance for this position size. Reduce
                quantity or close another position first.
              </p>
            ) : (
              !canSubmit && (
                <p className="mt-2 text-center text-xs text-muted-2">
                  A trade thesis is required before entering.
                </p>
              )
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
