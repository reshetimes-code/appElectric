import { NextResponse } from "next/server";

const ADMIN_COOKIE = "appelectric_admin";
// Demo-only shared password. Set ADMIN_PASSWORD in .env.local to change it.
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "appelectric-admin";

export async function POST(request: Request) {
  const { password } = await request.json();
  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "סיסמה שגויה" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, "ok", {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(ADMIN_COOKIE);
  return res;
}
