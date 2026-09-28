"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useTransition } from "react";
import { useGlobalLoading } from "@/lib/context/GlobalLoadingContext";

/**
 * router.refresh() returns no promise, so a fetch wrapped in
 * useGlobalLoading().withLoading() finishes (and hides the overlay) before
 * the refreshed server data has actually re-rendered — a delete looked
 * "done" while the deleted row was still on screen for another beat.
 * Wrapping the refresh in a transition and tracking its own isPending keeps
 * the overlay up until React actually commits the refreshed page.
 */
export function useLoadedRefresh() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { begin, end } = useGlobalLoading();
  const waiting = useRef(false);

  useEffect(() => {
    if (waiting.current && !isPending) {
      waiting.current = false;
      end();
    }
  }, [isPending, end]);

  return () => {
    waiting.current = true;
    begin();
    startTransition(() => {
      router.refresh();
    });
  };
}
