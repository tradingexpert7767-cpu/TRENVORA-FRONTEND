import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef } from "react";

export function Input({ className, ...props }: ComponentPropsWithoutRef<"input">) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-[var(--radius-md)] border border-border-strong bg-surface px-3.5 text-sm text-foreground placeholder:text-muted-2 outline-none transition-colors focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/40",
        className,
      )}
      {...props}
    />
  );
}

export function Label({
  className,
  ...props
}: ComponentPropsWithoutRef<"label">) {
  return (
    <label
      className={cn("mb-1.5 block text-sm font-medium text-foreground", className)}
      {...props}
    />
  );
}
