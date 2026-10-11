"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Sun, Moon, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

type ThemeMode = "dark" | "light" | "system";

function systemPrefersLight() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: light)").matches;
}

function applyResolvedTheme(mode: ThemeMode) {
  const resolved = mode === "system" ? (systemPrefersLight() ? "light" : "dark") : mode;
  if (resolved === "light") {
    document.documentElement.setAttribute("data-theme", "light");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
}

const options: { mode: ThemeMode; label: string; icon: typeof Sun }[] = [
  { mode: "dark", label: "Dark", icon: Moon },
  { mode: "light", label: "Light", icon: Sun },
  { mode: "system", label: "System", icon: Monitor },
];

export function ThemeToggle({ className }: { className?: string }) {
  // "dark" is the SSR-safe default so the first client render matches the
  // server exactly — the real stored mode is read and applied post-mount.
  const [mode, setMode] = useState<ThemeMode>("dark");

  useEffect(() => {
    const stored = localStorage.getItem("trenvora-theme");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of browser-only storage to sync post-hydration; no alternative to an effect here.
    setMode(stored === "light" || stored === "system" ? stored : "dark");
  }, []);

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mode !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    const onChange = () => applyResolvedTheme("system");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [mode]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  function choose(next: ThemeMode) {
    setMode(next);
    localStorage.setItem("trenvora-theme", next);
    applyResolvedTheme(next);
    setOpen(false);
  }

  const ActiveIcon = options.find((o) => o.mode === mode)?.icon ?? Moon;

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={`Theme: ${mode}. Click to change.`}
        aria-haspopup="menu"
        aria-expanded={open}
        suppressHydrationWarning
        className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-[var(--radius-sm)] text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
      >
        <ActiveIcon className="h-4 w-4" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            role="menu"
            aria-label="Theme"
            className="absolute right-0 top-full z-50 mt-2 w-36 overflow-hidden rounded-[var(--radius-md)] border border-border-strong bg-surface p-1 shadow-xl"
          >
            {options.map(({ mode: m, label, icon: Icon }) => (
              <button
                key={m}
                type="button"
                role="menuitemradio"
                aria-checked={mode === m}
                onClick={() => choose(m)}
                className={cn(
                  "flex min-h-10 w-full cursor-pointer items-center gap-2.5 rounded-[var(--radius-sm)] px-2.5 py-2 text-left text-sm transition-colors",
                  mode === m ? "bg-primary/10 text-primary" : "text-muted hover:bg-surface-2 hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
