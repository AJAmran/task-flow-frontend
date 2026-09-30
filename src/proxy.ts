import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, resolveLanding } from "@/lib/session";

const PROTECTED_PREFIXES = ["/admin", "/dashboard", "/organizations"];
const GUEST_ONLY = ["/login", "/register"];

// NOTE: Backend auth cookies live on the API domain (cross-site), so the
// proxy cannot see them. It relies on the frontend-domain marker cookie
// (`tf_landing`) set by every login flow. Real authorization is enforced by
// AuthGuard / RoleGuard via GET /auth/me.
export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const landing = resolveLanding(
    request.cookies.get(SESSION_COOKIE)?.value
      ? decodeURIComponent(request.cookies.get(SESSION_COOKIE)!.value)
      : null,
  );
  const hasSession = request.cookies.has(SESSION_COOKIE);

  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (isProtected && !hasSession) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (GUEST_ONLY.includes(pathname) && hasSession) {
    const homeUrl = request.nextUrl.clone();
    homeUrl.pathname = landing;
    homeUrl.search = "";
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/organizations/:path*",
    "/login",
    "/register",
  ],
};
