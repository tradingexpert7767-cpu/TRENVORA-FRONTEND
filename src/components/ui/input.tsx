import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

export function Input({ className, ...props }: ComponentPropsWithoutRef<"input">) {
  return (
    <input
      className={cn(
        // 16px text on mobile stops iOS from zooming the page on focus.
        "h-11 w-full rounded-[var(--radius-md)] border border-border-strong bg-surface px-3.5 text-base text-foreground placeholder:text-muted-2 outline-none transition-colors focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/40 aria-[invalid=true]:border-negative aria-[invalid=true]:focus-visible:ring-negative/40 sm:text-sm",
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

/** Inline error under a field; render nothing when there's no message. */
export function FieldError({ id, children }: { id: string; children?: ReactNode }) {
  if (!children) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-xs leading-snug text-negative">
      {children}
    </p>
  );
}
