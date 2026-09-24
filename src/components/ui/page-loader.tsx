export function PageLoader() {
  return (
    <div className="flex min-h-[60dvh] flex-1 items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-border-strong border-t-primary" />
        <p className="text-xs text-muted-2">Loading…</p>
      </div>
    </div>
  );
}
