import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PREFIXES = ["/admin", "/dashboard", "/organizations"];
const GUEST_ONLY = ["/login", "/register"];

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession =
    request.cookies.has("accessToken") ||
    request.cookies.has("refreshToken");

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
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = "/dashboard";
    dashboardUrl.search = "";
    return NextResponse.redirect(dashboardUrl);
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
