// Signed admin session tokens, built on the Web Crypto API (available both
// in middleware's edge runtime and in Node route handlers — unlike Node's
// `crypto.timingSafeEqual`/`createHmac`, so this one file works in both).
//
// Previously the session cookie's value was the literal constant string
// "ok" — anyone who could get that exact string into a cookie named
// appelectric_admin for this origin (e.g. a bug elsewhere that reflects a
// cookie value, or a future subdomain sharing this parent domain) would be
// treated as a logged-in admin, no password required. A token is now
// `${expiresAt}.${hmac}`, where `hmac` is only reproducible by someone who
// knows SESSION_SECRET — the cookie can't be forged, and it self-expires
// server-side regardless of what maxAge the browser was told.

const SESSION_SECRET = process.env.SESSION_SECRET || "dev-only-insecure-secret-change-me";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days, matches the cookie's maxAge

async function hmacHex(message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(SESSION_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Constant-time string comparison — avoids leaking how many leading
 * characters matched via response-time differences. */
export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export type AdminRole = "admin" | "worker";

// Token is `${expiresAt}.${role}.${hmac}` — the role is covered by the HMAC,
// so a worker cookie can't be edited into an admin one.
export async function createSessionToken(role: AdminRole = "admin"): Promise<string> {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const sig = await hmacHex(`${expiresAt}.${role}`);
  return `${expiresAt}.${role}.${sig}`;
}

/** Returns the session's role, or null if the token is missing/forged/expired. */
export async function getSessionRole(token: string | undefined): Promise<AdminRole | null> {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [expiresAtStr, role, sig] = parts;
  if (role !== "admin" && role !== "worker") return null;
  const expiresAt = Number(expiresAtStr);
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) return null;
  const expected = await hmacHex(`${expiresAtStr}.${role}`);
  return timingSafeEqual(sig, expected) ? role : null;
}

export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  return (await getSessionRole(token)) !== null;
}

/** Areas a worker may open (UI pages + the API routes those pages call). */
const WORKER_PREFIXES = [
  "/admin/products",
  "/admin/bundles",
  "/api/admin/products",
  "/api/admin/bundles",
  "/api/admin/brands",
  "/api/admin/categories",
  "/api/admin/subcategories",
  "/api/admin/screen-sizes",
  "/api/admin/upload",
];

export function workerCanAccess(pathname: string): boolean {
  return WORKER_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

export const SESSION_MAX_AGE_SECONDS = SESSION_TTL_MS / 1000;
