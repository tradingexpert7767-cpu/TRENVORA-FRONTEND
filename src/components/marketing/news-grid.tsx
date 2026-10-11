"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Newspaper, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useDialog } from "@/hooks/use-dialog";
import type { LiveNewsItem } from "@/lib/news";
import { cn } from "@/lib/utils";

export function NewsGrid({ news, className }: { news: LiveNewsItem[]; className?: string }) {
  const [active, setActive] = useState<LiveNewsItem | null>(null);
  const reduceMotion = useReducedMotion();
  const close = () => setActive(null);
  const panelRef = useDialog<HTMLDivElement>(active !== null, close);
  const titleId = useId();

  return (
    <>
      <ul className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>
        {news.map((item) => (
          <li key={item.id}>
            {/* A button may only hold phrasing content, so the card is built from spans. */}
            <button
              type="button"
              onClick={() => setActive(item)}
              className="flex h-full w-full cursor-pointer flex-col rounded-[var(--radius-lg)] border border-border bg-surface p-6 text-left transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-lg hover:shadow-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-reduce:hover:translate-y-0"
            >
              <span className="flex items-start justify-between gap-2">
                <Badge tone="neutral">{item.source}</Badge>
                <span className="text-xs text-muted">{item.time}</span>
              </span>
              <span className="mt-2.5 block text-sm font-medium leading-snug">{item.headline}</span>
              {item.summary && (
                <span className="mt-1.5 line-clamp-2 block text-sm leading-relaxed text-muted">
                  {item.summary}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center sm:p-4"
            onClick={close}
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
              className="w-full max-w-md rounded-t-[var(--radius-lg)] border border-border-strong bg-surface p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] outline-none sm:rounded-[var(--radius-lg)] sm:pb-6"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 pt-3 text-xs text-muted">
                  <Newspaper className="h-3.5 w-3.5" aria-hidden="true" />
                  {active.source} &middot; {active.time}
                </div>
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close"
                  className="-mr-2 -mt-2 inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-[var(--radius-sm)] text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <h2 id={titleId} className="mt-2 text-lg font-semibold leading-snug">
                {active.headline}
              </h2>

              {active.summary && (
                <p className="mt-3 text-sm leading-relaxed text-muted">{active.summary}</p>
              )}

              <a
                href={active.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-[var(--radius-md)] bg-primary text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Read full article on {active.source}
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
              <p className="mt-2.5 text-center text-xs text-muted">
                Opens in a new tab — you&apos;ll stay logged in here.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
