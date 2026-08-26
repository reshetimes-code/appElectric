"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Hydration-safe localStorage-backed state. Renders the given `initial` value
 * on the server and on first client paint, then syncs from localStorage right
 * after mount — avoids SSR/client markup mismatches.
 */
export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw != null) setValue(JSON.parse(raw) as T);
    } catch {
      // ignore malformed storage
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // storage unavailable (private mode, quota) — fail silently
    }
  }, [key, value, hydrated]);

  const update = useCallback((updater: T | ((prev: T) => T)) => {
    setValue((prev) => (typeof updater === "function" ? (updater as (p: T) => T)(prev) : updater));
  }, []);

  return [value, update, hydrated] as const;
}
