"use client";

import { useFilterParams } from "@/lib/hooks/useFilterParams";
import { Spinner } from "@/components/ui/Spinner";

/**
 * Filter/sort changes re-fetch from Firestore (force-dynamic pages), which can
 * take a moment. useFilterParams wraps its router.push in a transition, and
 * this shows a spinner immediately (no delay, unlike the global route
 * loading.tsx) right over the results the user is waiting on.
 */
export function ResultsPendingOverlay() {
  const { isPending } = useFilterParams();
  if (!isPending) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className="absolute inset-0 z-10 flex items-start justify-center bg-sand-100/60 pt-24 backdrop-blur-[1px]"
    >
      <Spinner size={32} className="text-charcoal-900" />
      <span className="sr-only">מעדכן תוצאות…</span>
    </div>
  );
}
