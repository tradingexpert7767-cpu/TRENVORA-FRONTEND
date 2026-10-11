"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

/**
 * False during SSR and the hydration pass, true afterwards. Gate anything
 * read from persisted (localStorage) stores behind this so the first client
 * render matches the server HTML.
 */
export function useHydrated() {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}
