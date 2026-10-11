"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FieldError, Input, Label } from "@/components/ui/input";
import { useDialog } from "@/hooks/use-dialog";
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

type Field = "quantity" | "stopLoss" | "target" | "thesis";

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

function defaultLevels(price: number, side: Side, isOption: boolean) {
  const slPct = isOption ? 0.3 : 0.003;
  const tgtPct = isOption ? 0.4 : 0.006;
  return side === "BUY"
    ? { stopLoss: round2(price * (1 - slPct)), target: round2(price * (1 + tgtPct)) }
    : { stopLoss: round2(price * (1 + slPct)), target: round2(price * (1 - tgtPct)) };
}

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
  const reduceMotion = useReducedMotion();
  const panelRef = useDialog<HTMLDivElement>(open, onClose);
  const titleId = useId();
  const emotionLabelId = useId();

  const [side, setSide] = useState<Side>(forceSide ?? "BUY");
  const initial = defaultLevels(currentPrice, forceSide ?? "BUY", isOption);
  // Inputs hold raw strings so an empty field stays empty instead of
  // silently becoming 0.
  const [quantity, setQuantity] = useState(String(lotSize));
  const [stopLoss, setStopLoss] = useState(String(initial.stopLoss));
  const [target, setTarget] = useState(String(initial.target));
  const [levelsEdited, setLevelsEdited] = useState(false);
  const [thesis, setThesis] = useState("");
  const [emotion, setEmotion] = useState<Emotion>("Calm");
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);

  const qty = Number(quantity);
  const sl = Number(stopLoss);
  const tgt = Number(target);

  const errors: Partial<Record<Field, string>> = {};
  if (!quantity.trim() || !Number.isInteger(qty) || qty <= 0) {
    errors.quantity = "Enter a whole number greater than 0.";
  } else if (isOption && qty % lotSize !== 0) {
    errors.quantity = `Options trade in lots of ${lotSize}. Try ${Math.max(lotSize, Math.round(qty / lotSize) * lotSize)}.`;
  }
  if (!stopLoss.trim() || !(sl > 0)) {
    errors.stopLoss = "Enter a stop loss price.";
  } else if (side === "BUY" && sl >= currentPrice) {
    errors.stopLoss = `For a buy, stop loss must be below entry (${currentPrice.toFixed(2)}).`;
  } else if (side === "SELL" && sl <= currentPrice) {
    errors.stopLoss = `For a sell, stop loss must be above entry (${currentPrice.toFixed(2)}).`;
  }
  if (!target.trim() || !(tgt > 0)) {
    errors.target = "Enter a target price.";
  } else if (side === "BUY" && tgt <= currentPrice) {
    errors.target = `For a buy, target must be above entry (${currentPrice.toFixed(2)}).`;
  } else if (side === "SELL" && tgt >= currentPrice) {
    errors.target = `For a sell, target must be below entry (${currentPrice.toFixed(2)}).`;
  }
  if (!thesis.trim()) {
    errors.thesis = "Write down why you're entering — this is what your AI Coach learns from.";
  }

  const validQty = errors.quantity ? 0 : qty;
  const risk = errors.stopLoss ? 0 : Math.abs(currentPrice - sl) * validQty;
  const reward = errors.target ? 0 : Math.abs(tgt - currentPrice) * validQty;
  const rr = risk > 0 && reward > 0 ? (reward / risk).toFixed(2) : "—";
  const requiredMargin = computeRequiredMargin(currentPrice, validQty, isOption);
  const insufficientFunds = availableBalance !== undefined && requiredMargin > availableBalance;

  const show = (field: Field) => (submitted || touched[field]) && errors[field];

  function chooseSide(next: Side) {
    setSide(next);
    // Mirror the suggested SL/target to the correct side unless the trader
    // has already typed their own levels.
    if (!levelsEdited) {
      const levels = defaultLevels(currentPrice, next, isOption);
      setStopLoss(String(levels.stopLoss));
      setTarget(String(levels.target));
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
    const firstInvalid = (["quantity", "stopLoss", "target", "thesis"] as Field[]).find((f) => errors[f]);
    if (firstInvalid) {
      panelRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }
    if (insufficientFunds) return;
    onSubmit({ side, quantity: qty, stopLoss: sl, target: tgt, thesis: thesis.trim(), emotion });
  }

  const fieldIds = {
    quantity: `${titleId}-qty`,
    stopLoss: `${titleId}-sl`,
    target: `${titleId}-target`,
    thesis: `${titleId}-thesis`,
    entry: `${titleId}-entry`,
  };

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
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[92dvh] w-full overflow-y-auto rounded-t-[var(--radius-lg)] border border-border-strong bg-surface p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] outline-none sm:max-w-lg sm:rounded-[var(--radius-lg)] sm:pb-6"
          >
            <form onSubmit={handleSubmit} noValidate>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-muted">{instrument} &middot; Paper</p>
                  <h2 id={titleId} className="mt-1 text-lg font-semibold">
                    Why are you entering?
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="-mr-2 -mt-2 inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-[var(--radius-sm)] text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
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
                <div role="radiogroup" aria-label="Direction" className="mt-5 grid grid-cols-2 gap-2">
                  {(["BUY", "SELL"] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      role="radio"
                      aria-checked={side === s}
                      onClick={() => chooseSide(s)}
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
                  <Label htmlFor={fieldIds.quantity}>
                    {isOption ? `Quantity (lot ${lotSize})` : "Quantity"}
                  </Label>
                  <Input
                    id={fieldIds.quantity}
                    name="quantity"
                    type="number"
                    inputMode="numeric"
                    min={isOption ? lotSize : 1}
                    step={isOption ? lotSize : 1}
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, quantity: true }))}
                    aria-invalid={Boolean(show("quantity"))}
                    aria-describedby={show("quantity") ? `${fieldIds.quantity}-err` : undefined}
                  />
                  <FieldError id={`${fieldIds.quantity}-err`}>{show("quantity")}</FieldError>
                </div>
                <div>
                  <Label htmlFor={fieldIds.entry}>{isOption ? "Entry premium" : "Entry (market)"}</Label>
                  <Input
                    id={fieldIds.entry}
                    value={currentPrice.toFixed(2)}
                    readOnly
                    aria-readonly="true"
                    className="border-dashed bg-surface-2 font-mono tabular-nums text-muted"
                  />
                </div>
                <div>
                  <Label htmlFor={fieldIds.stopLoss}>Stop loss</Label>
                  <Input
                    id={fieldIds.stopLoss}
                    name="stopLoss"
                    type="number"
                    inputMode="decimal"
                    min={0}
                    step="0.05"
                    value={stopLoss}
                    onChange={(e) => {
                      setStopLoss(e.target.value);
                      setLevelsEdited(true);
                    }}
                    onBlur={() => setTouched((t) => ({ ...t, stopLoss: true }))}
                    aria-invalid={Boolean(show("stopLoss"))}
                    aria-describedby={show("stopLoss") ? `${fieldIds.stopLoss}-err` : undefined}
                    className="font-mono tabular-nums"
                  />
                  <FieldError id={`${fieldIds.stopLoss}-err`}>{show("stopLoss")}</FieldError>
                </div>
                <div>
                  <Label htmlFor={fieldIds.target}>Target</Label>
                  <Input
                    id={fieldIds.target}
                    name="target"
                    type="number"
                    inputMode="decimal"
                    min={0}
                    step="0.05"
                    value={target}
                    onChange={(e) => {
                      setTarget(e.target.value);
                      setLevelsEdited(true);
                    }}
                    onBlur={() => setTouched((t) => ({ ...t, target: true }))}
                    aria-invalid={Boolean(show("target"))}
                    aria-describedby={show("target") ? `${fieldIds.target}-err` : undefined}
                    className="font-mono tabular-nums"
                  />
                  <FieldError id={`${fieldIds.target}-err`}>{show("target")}</FieldError>
                </div>
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-3 rounded-[var(--radius-md)] border border-border bg-surface-2 px-4 py-3 text-sm">
                <div>
                  <dt className="text-xs text-muted">Risk</dt>
                  <dd className="mt-0.5 font-mono font-medium tabular-nums text-negative">
                    ₹{risk.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">Risk : Reward</dt>
                  <dd className="mt-0.5 font-mono font-medium tabular-nums">1 : {rr}</dd>
                </div>
                {availableBalance !== undefined && (
                  <>
                    <div>
                      <dt className="text-xs text-muted">
                        {isOption ? "Premium payable" : "Required margin (18%)"}
                      </dt>
                      <dd
                        className={cn(
                          "mt-0.5 font-mono font-medium tabular-nums",
                          insufficientFunds && "text-negative",
                        )}
                      >
                        ₹{requiredMargin.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted">Available balance</dt>
                      <dd className="mt-0.5 font-mono font-medium tabular-nums">
                        ₹{availableBalance.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                      </dd>
                    </div>
                  </>
                )}
              </dl>

              <div className="mt-4">
                <Label htmlFor={fieldIds.thesis}>
                  Trade thesis <span className="text-negative" aria-hidden="true">*</span>
                </Label>
                <textarea
                  id={fieldIds.thesis}
                  name="thesis"
                  value={thesis}
                  onChange={(e) => setThesis(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, thesis: true }))}
                  placeholder="e.g. Breakout above previous high with rising volume."
                  rows={3}
                  required
                  aria-invalid={Boolean(show("thesis"))}
                  aria-describedby={show("thesis") ? `${fieldIds.thesis}-err` : undefined}
                  className="w-full resize-none rounded-[var(--radius-md)] border border-border-strong bg-surface px-3.5 py-2.5 text-base text-foreground outline-none transition-colors placeholder:text-muted-2 focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/40 aria-[invalid=true]:border-negative sm:text-sm"
                />
                <FieldError id={`${fieldIds.thesis}-err`}>{show("thesis")}</FieldError>
              </div>

              <div className="mt-4">
                <p id={emotionLabelId} className="mb-1.5 block text-sm font-medium text-foreground">
                  How are you feeling?
                </p>
                <div role="radiogroup" aria-labelledby={emotionLabelId} className="flex flex-wrap gap-2">
                  {emotions.map((e) => (
                    <button
                      key={e}
                      type="button"
                      role="radio"
                      aria-checked={emotion === e}
                      onClick={() => setEmotion(e)}
                      className={cn(
                        "min-h-10 cursor-pointer rounded-full border px-3.5 text-sm font-medium transition-colors",
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

              <Button type="submit" size="lg" disabled={insufficientFunds} className="mt-6 w-full">
                Confirm paper trade
              </Button>
              {insufficientFunds && (
                <p role="alert" className="mt-2 text-center text-sm text-negative">
                  Not enough available balance for this position size. Reduce quantity or close
                  another position first.
                </p>
              )}
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
