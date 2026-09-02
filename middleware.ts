import { NextResponse, type NextRequest } from "next/server";

// Minimal password gate for /admin — protects the admin UI and its API routes
// so they're not wide open. This is intentionally simple (a single shared
// password in an env var, a signed-nothing session cookie) and is NOT
// production-grade authentication: no per-user accounts, no roles, no
// hashing/rotation. Real admin auth (roles, real sessions) is a Phase C item
// once there's a real backend/DB — see README.md.
const ADMIN_COOKIE = "appelectric_admin";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminArea = pathname.startsWith("/admin") && pathname !== "/admin/login";
  const isAdminApi = pathname.startsWith("/api/admin") && pathname !== "/api/admin/login";

  if (!isAdminArea && !isAdminApi) return NextResponse.next();

  const cookie = request.cookies.get(ADMIN_COOKIE)?.value;
  if (cookie === "ok") return NextResponse.next();

  if (isAdminApi) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
