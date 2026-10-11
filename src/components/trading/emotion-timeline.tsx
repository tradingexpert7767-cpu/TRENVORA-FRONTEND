"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { ClosedTrade } from "@/lib/trade-store";
import { emotionState } from "@/lib/behavior-analysis";
import { cn } from "@/lib/utils";

export function EmotionTimeline({ history }: { history: ClosedTrade[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  // Oldest → newest, left to right, matching how you'd read a real timeline.
  const chronological = [...history].reverse();
  const tenseCount = chronological.filter((t) => emotionState(t.emotion) === "tense").length;
  const calmCount = chronological.length - tenseCount;

  const active = chronological.find((t) => t.id === activeId) ?? null;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted">
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-positive" />
          Calm / Confident ({calmCount})
        </span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="h-2.5 w-2.5 rotate-45 rounded-[2px] bg-negative" />
          FOMO / Revenge / Fearful / Uncertain ({tenseCount})
        </span>
      </div>

      <div className="relative mt-5 flex items-center overflow-x-auto pb-2">
        <div aria-hidden="true" className="pointer-events-none absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-border" />
        {chronological.map((t) => {
          const state = emotionState(t.emotion);
          const isActive = activeId === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveId(isActive ? null : t.id)}
              aria-pressed={isActive}
              className="relative z-10 flex h-11 w-9 shrink-0 cursor-pointer items-center justify-center rounded-[var(--radius-sm)]"
              aria-label={`${t.instrument}, ${t.emotion}, ${t.pnl >= 0 ? "profit" : "loss"}`}
            >
              <motion.span
                animate={{ scale: isActive ? 1.4 : 1 }}
                transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 400, damping: 20 }}
                className={cn(
                  "h-2.5 w-2.5 ring-2 ring-offset-2 ring-offset-surface",
                  // Shape as well as colour: circle = calm, diamond = tense.
                  state === "calm"
                    ? "rounded-full bg-positive ring-positive/30"
                    : "rotate-45 rounded-[2px] bg-negative ring-negative/30",
                )}
              />
            </button>
          );
        })}
      </div>

      <div aria-live="polite" className="mt-3 min-h-[52px] rounded-[var(--radius-md)] border border-border bg-surface-2 px-4 py-3">
        {active ? (
          <>
            <p className="text-sm font-medium">
              {active.instrument} &middot;{" "}
              <span className={emotionState(active.emotion) === "calm" ? "text-positive" : "text-negative"}>
                {active.emotion}
              </span>
            </p>
            <p className="mt-0.5 text-xs text-muted">
              {new Date(active.closedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
              {" · "}
              {active.pnl >= 0 ? "+" : "-"}₹{Math.abs(Math.round(active.pnl)).toLocaleString("en-IN")}
              {" · "}
              &ldquo;{active.thesis}&rdquo;
            </p>
          </>
        ) : (
          <p className="text-xs text-muted">
            Select a point to see that trade&apos;s emotion, outcome, and thesis.
          </p>
        )}
      </div>
    </div>
  );
}
