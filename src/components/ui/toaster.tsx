"use client";

import { Toaster as Sonner } from "sonner";

export function Toaster() {
  return (
    <Sonner
      position="bottom-right"
      theme="dark"
      toastOptions={{
        classNames: {
          toast:
            "!bg-surface-2 !border !border-border-strong !text-foreground !shadow-xl !rounded-[var(--radius-md)]",
          title: "!text-foreground !font-medium",
          description: "!text-muted",
          actionButton: "!bg-primary !text-primary-foreground",
          cancelButton: "!bg-surface !text-muted",
          success: "!text-positive",
          error: "!text-negative",
        },
      }}
    />
  );
}
