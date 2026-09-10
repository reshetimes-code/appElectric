"use client";

import { useEffect, useState } from "react";

/**
 * Turns a boolean "is this pending?" flag into "has it been pending for
 * more than `delayMs`?" — so a fast (<delayMs) wait never flashes a loader,
 * and only a genuinely slow one shows it. Used for both full-page route
 * transitions (see components/ui/RouteLoadingOverlay.tsx) and in-place async
 * actions (button clicks that submit/fetch without navigating).
 */
export function useDelayedPending(pending: boolean, delayMs = 500): boolean {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!pending) {
      setVisible(false);
      return;
    }
    const timer = setTimeout(() => setVisible(true), delayMs);
    return () => clearTimeout(timer);
  }, [pending, delayMs]);

  return visible;
}
