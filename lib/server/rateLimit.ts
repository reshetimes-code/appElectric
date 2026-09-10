import { Firestore } from "@google-cloud/firestore";

// Guards against accidental import from client bundles.
if (typeof window !== "undefined") {
  throw new Error("lib/server/rateLimit.ts must only be imported from server code");
}

// Simple fixed-window rate limiter backed by Firestore, so the count is
// shared across every Cloud Run instance (an in-memory counter wouldn't be —
// each instance would have its own, making it trivial to bypass by hitting
// whichever instance has the freshest counter). Used only on the few
// sensitive endpoints where brute-forcing/spamming actually matters (admin
// login, order lookup, order creation) — not on every request site-wide.
const firestore = new Firestore({ projectId: "appelectric" });

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

/** Returns true if this call is allowed, false if the limit was already hit
 * for the current window. */
export async function checkRateLimit(scope: string, identifier: string, limit: number, windowMs: number): Promise<boolean> {
  const ref = firestore.collection("rateLimits").doc(`${scope}:${identifier}`);
  const now = Date.now();
  try {
    return await firestore.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      const data = snap.exists ? (snap.data() as { count: number; windowStart: number }) : undefined;
      if (!data || now - data.windowStart > windowMs) {
        tx.set(ref, { count: 1, windowStart: now });
        return true;
      }
      if (data.count >= limit) return false;
      tx.update(ref, { count: data.count + 1 });
      return true;
    });
  } catch {
    // If Firestore is unreachable, fail open rather than taking the whole
    // site down over a rate-limit check.
    return true;
  }
}
