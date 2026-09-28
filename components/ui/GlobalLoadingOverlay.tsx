"use client";

import { useGlobalLoading } from "@/lib/context/GlobalLoadingContext";
import { useDelayedPending } from "@/lib/hooks/useDelayedPending";
import { Spinner } from "@/components/ui/Spinner";

/** Full-page overlay for any action wrapped in useGlobalLoading().withLoading —
 * deletes, status updates, form submits — so it's obvious something is
 * happening no matter where on the page the user is looking. */
export function GlobalLoadingOverlay() {
  const { isLoading } = useGlobalLoading();
  const visible = useDelayedPending(isLoading, 300);
  if (!visible) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[200] flex items-center justify-center bg-sand-100/70 backdrop-blur-[1px]"
    >
      <Spinner size={40} className="text-charcoal-900" />
      <span className="sr-only">מעבד…</span>
    </div>
  );
}
