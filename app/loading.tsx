import { RouteLoadingOverlay } from "@/components/ui/RouteLoadingOverlay";

// Global fallback: Next.js wraps every page below this in a Suspense
// boundary using this file, unless a more specific loading.tsx overrides it
// for a given segment. Covers both the first full-page load and client-side
// navigations, site-wide, with a single file.
export default function Loading() {
  return <RouteLoadingOverlay />;
}
