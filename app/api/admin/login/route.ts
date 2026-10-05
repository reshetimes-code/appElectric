import { NextResponse } from "next/server";
import { createSessionToken, timingSafeEqual, SESSION_MAX_AGE_SECONDS } from "@/lib/adminSession";
import { checkRateLimit, getClientIp } from "@/lib/server/rateLimit";

const ADMIN_COOKIE = "appelectric_admin";
// Demo-only shared password. Set ADMIN_PASSWORD in .env.local to change it.
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "appelectric-admin";
// Restricted "worker" login (products + premium bundles only). Disabled unless set.
const WORKER_PASSWORD = process.env.WORKER_PASSWORD || "";

function matches(input: string, expected: string) {
  return expected.length > 0 && input.length === expected.length && timingSafeEqual(input, expected);
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  // 10 attempts per 15 minutes per IP — generous for a real admin who
  // mistypes a few times, but shuts down a brute-force script fast.
  const allowed = await checkRateLimit("admin-login", ip, 10, 15 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json({ error: "יותר מדי ניסיונות התחברות — נסו שוב בעוד כמה דקות" }, { status: 429 });
  }

  const { password } = await request.json();
  const role = typeof password !== "string" ? null : matches(password, ADMIN_PASSWORD) ? "admin" : matches(password, WORKER_PASSWORD) ? "worker" : null;
  if (!role) {
    return NextResponse.json({ error: "סיסמה שגויה" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, await createSessionToken(role), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: "/",
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(ADMIN_COOKIE);
  return res;
}
