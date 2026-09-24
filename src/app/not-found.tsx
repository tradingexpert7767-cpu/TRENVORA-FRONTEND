"use client";

import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/logo";
import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-1 flex-col items-center justify-center px-5 text-center">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center"
      >
        <Logo className="h-10 w-10" />

        <motion.svg
          viewBox="0 0 220 70"
          className="mt-8 h-16 w-52"
          aria-hidden="true"
        >
          <motion.path
            d="M0 50 L22 44 L44 52 L66 30 L88 38 L110 16 L132 24 L154 8 L176 20 L198 4 L220 12"
            fill="none"
            stroke="var(--color-negative)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          />
        </motion.svg>

        <h1 className="mt-6 text-5xl font-semibold tracking-tight">404</h1>
        <p className="mt-3 max-w-sm text-muted">
          This page moved, got closed out, or never existed — like a trade
          with no thesis behind it.
        </p>

        <ButtonLink href="/" size="lg" className="mt-8">
          <ArrowLeft className="h-4 w-4" />
          Back to Trenvora
        </ButtonLink>
      </motion.div>
    </main>
  );
}
