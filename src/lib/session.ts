// Frontend-domain session hint for proxy.ts.
//
// The backend sets its httpOnly auth cookies on the API domain, which is
// cross-site from the frontend (localhost / *.vercel.app). The Next proxy
// cannot see those cookies, so every login flow sets this marker cookie on
// the FRONTEND domain and every logout clears it. It is only a routing hint —
// real authorization always happens via useGetMe + AuthGuard/RoleGuard.

export const SESSION_COOKIE = "tf_landing";

const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export function resolveLanding(path?: string | null): string {
  if (path && path.startsWith("/") && !path.startsWith("//")) {
    return path;
  }
  return "/dashboard";
}

export function setSessionLanding(path?: string | null): void {
  const landing = resolveLanding(path);
  document.cookie = `${SESSION_COOKIE}=${encodeURIComponent(landing)}; path=/; max-age=${SESSION_MAX_AGE}; SameSite=Lax`;
}

export function clearSession(): void {
  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}
