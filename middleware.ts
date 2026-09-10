import { NextResponse, type NextRequest } from "next/server";
import { verifySessionToken } from "@/lib/adminSession";

// Password gate for /admin — protects the admin UI and its API routes so
// they're not wide open. The session cookie is an HMAC-signed, self-expiring
// token (see lib/adminSession.ts) rather than a guessable constant, so it
// can't be forged without knowing SESSION_SECRET. Still not full
// production-grade auth (single shared password, no per-user accounts/roles)
// — see README "What's next" for that.
const ADMIN_COOKIE = "appelectric_admin";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminArea = pathname.startsWith("/admin") && pathname !== "/admin/login";
  const isAdminApi = pathname.startsWith("/api/admin") && pathname !== "/api/admin/login";

  if (!isAdminArea && !isAdminApi) return NextResponse.next();

  const cookie = request.cookies.get(ADMIN_COOKIE)?.value;
  if (await verifySessionToken(cookie)) return NextResponse.next();

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
