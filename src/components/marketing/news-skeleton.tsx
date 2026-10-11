import { cn } from "@/lib/utils";

// Same shape as NewsGrid cards so nothing jumps when headlines stream in.
export function NewsSkeleton({ count = 6, className }: { count?: number; className?: string }) {
  return (
    <div
      role="status"
      aria-label="Loading news"
      className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}
    >
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="flex h-40 flex-col gap-3 rounded-[var(--radius-lg)] border border-border bg-surface p-6"
        >
          <div className="flex justify-between">
            <div className="h-5 w-24 animate-pulse rounded-full bg-surface-2 motion-reduce:animate-none" />
            <div className="h-4 w-12 animate-pulse rounded bg-surface-2 motion-reduce:animate-none" />
          </div>
          <div className="h-4 w-full animate-pulse rounded bg-surface-2 motion-reduce:animate-none" />
          <div className="h-4 w-4/5 animate-pulse rounded bg-surface-2 motion-reduce:animate-none" />
          <div className="mt-auto h-3 w-3/5 animate-pulse rounded bg-surface-2 motion-reduce:animate-none" />
        </div>
      ))}
    </div>
  );
}
