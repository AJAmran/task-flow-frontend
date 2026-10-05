import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { resolveLanding, SESSION_COOKIE } from "@/lib/session";

const PROTECTED_PREFIXES = ["/admin", "/dashboard", "/organizations"];
const PROTECTED_EXACT = ["/accept-invitation", "/invite"];
const GUEST_ONLY = ["/login", "/register"];

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const landing = resolveLanding(
    request.cookies.get(SESSION_COOKIE)?.value
      ? decodeURIComponent(request.cookies.get(SESSION_COOKIE)!.value)
      : null,
  );
  const hasSession = request.cookies.has(SESSION_COOKIE);

  const isProtected =
    PROTECTED_PREFIXES.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    ) || PROTECTED_EXACT.includes(pathname);

  if (isProtected && !hasSession) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    const callback = `${pathname}${request.nextUrl.search}`;
    loginUrl.search = "";
    loginUrl.searchParams.set("callbackUrl", callback);
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
    "/accept-invitation",
    "/invite",
    "/login",
    "/register",
  ],
};
