"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Newspaper, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { LiveNewsItem } from "@/lib/news";
import { cn } from "@/lib/utils";

export function NewsGrid({ news, className }: { news: LiveNewsItem[]; className?: string }) {
  const [active, setActive] = useState<LiveNewsItem | null>(null);

  return (
    <>
      <div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>
        {news.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActive(item)}
            className="cursor-pointer text-left"
          >
            <Card className="h-full transition-all duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-lg hover:shadow-black/10">
              <div className="flex items-start justify-between gap-2">
                <Badge tone="neutral">{item.source}</Badge>
                <span className="text-xs text-muted-2">{item.time}</span>
              </div>
              <p className="mt-2.5 text-sm font-medium leading-snug">{item.headline}</p>
              {item.summary && (
                <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-2">
                  {item.summary}
                </p>
              )}
            </Card>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center sm:p-4"
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-t-[var(--radius-lg)] border border-border-strong bg-surface p-6 sm:rounded-[var(--radius-lg)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-muted-2">
                  <Newspaper className="h-3.5 w-3.5" />
                  {active.source} &middot; {active.time}
                </div>
                <button
                  type="button"
                  onClick={() => setActive(null)}
                  aria-label="Close"
                  className="cursor-pointer rounded-[var(--radius-sm)] p-1 text-muted hover:bg-surface-2 hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <h2 className="mt-3 text-lg font-semibold leading-snug">{active.headline}</h2>

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
                <ArrowUpRight className="h-4 w-4" />
              </a>
              <p className="mt-2.5 text-center text-xs text-muted-2">
                Opens in a new tab — you&apos;ll stay logged in here.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
