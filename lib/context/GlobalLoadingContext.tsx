"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface GlobalLoadingContextValue {
  isLoading: boolean;
  /** Wraps any async action (a fetch, a status update, a delete...) so the
   * global page overlay shows for its whole duration — even actions that
   * already have their own local spinner should still call this, so a user
   * looking anywhere on the page (not just at the button they clicked) can
   * tell something is happening. Multiple concurrent calls stack correctly:
   * the overlay stays up until the last one finishes. */
  withLoading: <T>(action: () => Promise<T>) => Promise<T>;
  /** Manual start/stop pair for a step withLoading can't wrap directly —
   * namely a router.refresh(), which returns no promise. Prefer
   * useLoadedRefresh() (lib/hooks/useLoadedRefresh.ts), which pairs these
   * with a transition so the overlay stays up until the refreshed data has
   * actually rendered, not just until the request that triggered it fires. */
  begin: () => void;
  end: () => void;
}

const GlobalLoadingContext = createContext<GlobalLoadingContextValue | null>(null);

export function GlobalLoadingProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(0);

  const begin = useCallback(() => setCount((c) => c + 1), []);
  const end = useCallback(() => setCount((c) => c - 1), []);

  const withLoading = useCallback(async <T,>(action: () => Promise<T>): Promise<T> => {
    setCount((c) => c + 1);
    try {
      return await action();
    } finally {
      setCount((c) => c - 1);
    }
  }, []);

  return <GlobalLoadingContext.Provider value={{ isLoading: count > 0, withLoading, begin, end }}>{children}</GlobalLoadingContext.Provider>;
}

export function useGlobalLoading() {
  const ctx = useContext(GlobalLoadingContext);
  if (!ctx) throw new Error("useGlobalLoading must be used within GlobalLoadingProvider");
  return ctx;
}
