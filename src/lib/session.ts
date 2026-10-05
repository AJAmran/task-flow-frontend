export const SESSION_COOKIE = "tf_landing";

const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

const NON_LANDING_PATHS = new Set([
  "/login",
  "/register",
  "/invite",
  "/accept-invitation",
]);

export function resolveLanding(path?: string | null): string {
  if (
    !path ||
    !path.startsWith("/") ||
    path.startsWith("//") ||
    path.includes("\\")
  ) {
    return "/dashboard";
  }
  if (NON_LANDING_PATHS.has(path.split(/[?#]/)[0])) {
    return "/dashboard";
  }
  return path;
}

export function setSessionLanding(path?: string | null): void {
  const landing = resolveLanding(path);
  document.cookie = `${SESSION_COOKIE}=${encodeURIComponent(landing)}; path=/; max-age=${SESSION_MAX_AGE}; SameSite=Lax`;
}

export function clearSession(): void {
  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}
