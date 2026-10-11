export function PageLoader() {
  return (
    <div role="status" aria-live="polite" className="flex min-h-[60dvh] flex-1 items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div aria-hidden="true" className="h-8 w-8 animate-spin rounded-full border-2 border-border-strong border-t-primary motion-reduce:animate-none" />
        <p className="text-sm text-muted">Loading…</p>
      </div>
    </div>
  );
}
