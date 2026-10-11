"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

// globals.css already neutralises CSS animations for reduced-motion users;
// this does the same for motion/react's JS-driven transforms.
export function Providers({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
