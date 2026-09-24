"use client";

import { useState } from "react";
import { motion } from "motion/react";
import type { ClosedTrade } from "@/lib/trade-store";
import { emotionState } from "@/lib/behavior-analysis";
import { cn } from "@/lib/utils";

export function EmotionTimeline({ history }: { history: ClosedTrade[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  // Oldest → newest, left to right, matching how you'd read a real timeline.
  const chronological = [...history].reverse();
  const tenseCount = chronological.filter((t) => emotionState(t.emotion) === "tense").length;
  const calmCount = chronological.length - tenseCount;

  const active = chronological.find((t) => t.id === activeId) ?? null;

  return (
    <div>
      <div className="flex items-center gap-4 text-xs text-muted-2">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-positive" />
          Calm / Confident ({calmCount})
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-negative" />
          FOMO / Revenge / Fearful / Uncertain ({tenseCount})
        </span>
      </div>

      <div className="relative mt-5 flex items-center gap-1.5 overflow-x-auto pb-2">
        <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-border" />
        {chronological.map((t) => {
          const state = emotionState(t.emotion);
          const isActive = activeId === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveId(isActive ? null : t.id)}
              className="relative z-10 flex shrink-0 flex-col items-center gap-1.5 p-1"
              aria-label={`${t.instrument}, ${t.emotion}, ${t.pnl >= 0 ? "profit" : "loss"}`}
            >
              <motion.span
                animate={{ scale: isActive ? 1.4 : 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className={cn(
                  "h-2.5 w-2.5 rounded-full ring-2 ring-offset-2 ring-offset-surface",
                  state === "calm" ? "bg-positive ring-positive/30" : "bg-negative ring-negative/30",
                )}
              />
            </button>
          );
        })}
      </div>

      <div className="mt-3 min-h-[52px] rounded-[var(--radius-md)] border border-border bg-surface-2 px-4 py-3">
        {active ? (
          <>
            <p className="text-sm font-medium">
              {active.instrument} &middot;{" "}
              <span className={emotionState(active.emotion) === "calm" ? "text-positive" : "text-negative"}>
                {active.emotion}
              </span>
            </p>
            <p className="mt-0.5 text-xs text-muted-2">
              {new Date(active.closedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
              {" · "}
              {active.pnl >= 0 ? "+" : "-"}₹{Math.abs(Math.round(active.pnl)).toLocaleString("en-IN")}
              {" · "}
              &ldquo;{active.thesis}&rdquo;
            </p>
          </>
        ) : (
          <p className="text-xs text-muted-2">
            Tap a point to see that trade&apos;s emotion, outcome, and thesis.
          </p>
        )}
      </div>
    </div>
  );
}
