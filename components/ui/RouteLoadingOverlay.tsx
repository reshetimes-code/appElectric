"use client";

import { useDelayedPending } from "@/lib/hooks/useDelayedPending";
import { Spinner } from "@/components/ui/Spinner";

/**
 * Rendered as app/loading.tsx's fallback, i.e. mounted by React/Next the
 * instant a route segment anywhere on the site suspends (full page loads and
 * client-side navigations alike — every nested route inherits this unless it
 * defines its own more specific loading.tsx). Since data now comes from
 * Firestore (network round-trip) instead of local files, navigations can
 * take noticeably longer than before; this only becomes visible once the
 * wait has actually lasted >500ms, so quick navigations never flash it.
 */
export function RouteLoadingOverlay() {
  const visible = useDelayedPending(true, 500);
  if (!visible) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-sand-100/70 backdrop-blur-[1px]"
    >
      <Spinner size={40} className="text-charcoal-900" />
      <span className="sr-only">טוען…</span>
    </div>
  );
}
