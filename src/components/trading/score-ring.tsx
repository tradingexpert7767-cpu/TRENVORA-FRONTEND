"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export function ScoreRing({ score, label = "Discipline score" }: { score: number; label?: string }) {
  const reduceMotion = useReducedMotion();
  const tone =
    score >= 70 ? "var(--color-positive)" : score >= 45 ? "var(--color-warning)" : "var(--color-negative)";

  return (
    <div
      role="img"
      aria-label={`${label}: ${score} out of 100`}
      className="relative flex h-36 w-36 shrink-0 items-center justify-center"
    >
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" aria-hidden="true">
        <circle
          cx="60"
          cy="60"
          r="52"
          fill="none"
          stroke="var(--color-border)"
          strokeWidth="10"
        />
        <motion.circle
          cx="60"
          cy="60"
          r="52"
          fill="none"
          stroke={tone}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={2 * Math.PI * 52}
          initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
          animate={{ strokeDashoffset: 2 * Math.PI * 52 * (1 - score / 100) }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <div className="absolute flex flex-col items-center" aria-hidden="true">
        <span className={cn("font-mono text-3xl font-semibold tracking-tight")}>{score}</span>
        <span className="text-xs text-muted-2">/ 100</span>
      </div>
    </div>
  );
}
