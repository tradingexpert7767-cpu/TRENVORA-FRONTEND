"use client";

import { useSyncExternalStore } from "react";
import { Toaster as Sonner } from "sonner";

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

function getTheme(): "light" | "dark" {
  return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
}

export function Toaster() {
  const theme = useSyncExternalStore(subscribe, getTheme, () => "dark" as const);
  return (
    <Sonner
      position="bottom-right"
      theme={theme}
      closeButton
      duration={4000}
      toastOptions={{
        classNames: {
          toast:
            "!bg-surface-2 !border !border-border-strong !text-foreground !shadow-xl !rounded-[var(--radius-md)]",
          title: "!text-foreground !font-medium",
          description: "!text-muted",
          actionButton: "!bg-primary !text-primary-foreground",
          cancelButton: "!bg-surface !text-muted",
          closeButton: "!bg-surface-2 !border-border-strong !text-muted",
          success: "!text-positive",
          error: "!text-negative",
        },
      }}
    />
  );
}
