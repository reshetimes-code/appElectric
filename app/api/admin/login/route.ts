import { NextResponse } from "next/server";
import { createSessionToken, timingSafeEqual, SESSION_MAX_AGE_SECONDS } from "@/lib/adminSession";
import { checkRateLimit, getClientIp } from "@/lib/server/rateLimit";

const ADMIN_COOKIE = "appelectric_admin";
// Demo-only shared password. Set ADMIN_PASSWORD in .env.local to change it.
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "appelectric-admin";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  // 10 attempts per 15 minutes per IP — generous for a real admin who
  // mistypes a few times, but shuts down a brute-force script fast.
  const allowed = await checkRateLimit("admin-login", ip, 10, 15 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json({ error: "יותר מדי ניסיונות התחברות — נסו שוב בעוד כמה דקות" }, { status: 429 });
  }

  const { password } = await request.json();
  const valid = typeof password === "string" && password.length === ADMIN_PASSWORD.length && timingSafeEqual(password, ADMIN_PASSWORD);
  if (!valid) {
    return NextResponse.json({ error: "סיסמה שגויה" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, await createSessionToken(), {
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
