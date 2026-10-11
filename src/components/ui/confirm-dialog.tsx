"use client";

import { useId } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDialog } from "@/hooks/use-dialog";

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  danger = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const panelRef = useDialog<HTMLDivElement>(open, onCancel);
  const titleId = useId();
  const descriptionId = useId();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={onCancel}
        >
          <motion.div
            ref={panelRef}
            role={danger ? "alertdialog" : "dialog"}
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            tabIndex={-1}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: 4 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-[var(--radius-lg)] border border-border-strong bg-surface p-6 shadow-2xl outline-none"
          >
            <div
              aria-hidden="true"
              className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${
                danger ? "bg-negative/10 text-negative" : "bg-primary/10 text-primary"
              }`}
            >
              <AlertTriangle className="h-5 w-5" />
            </div>
            <h2 id={titleId} className="mt-4 text-base font-semibold">
              {title}
            </h2>
            <p id={descriptionId} className="mt-1.5 text-sm leading-relaxed text-muted">
              {description}
            </p>

            <div className="mt-6 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
              {/* Cancel takes initial focus so Enter never confirms a destructive action by accident. */}
              <Button variant="secondary" onClick={onCancel} data-autofocus>
                Cancel
              </Button>
              <Button variant={danger ? "danger" : "primary"} onClick={onConfirm}>
                {confirmLabel}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
