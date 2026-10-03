"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { useGetMe } from "@/hooks";
import { clearSession } from "@/lib/session";
import AuthLoading from "./auth-loading";

export default function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();

  const { data, isPending, isError } = useGetMe();

  const user = data?.data;

  useEffect(() => {
    if (isPending) {
      return;
    }
    if (isError || !user) {
      // Drop the frontend session hint so the proxy stops bouncing
      // protected routes (expired backend session + stale marker = loop).
      clearSession();
      // Preserve the full destination (incl. ?token=) for post-login return.
      const dest =
        typeof window !== "undefined"
          ? window.location.pathname + window.location.search
          : "/login";
      router.replace(`/login?callbackUrl=${encodeURIComponent(dest)}`);
    }
  }, [isPending, isError, user, router]);

  if (isPending) {
    return <AuthLoading />;
  }

  if (isError || !user) {
    return <AuthLoading label="Redirecting..." />;
  }

  return <>{children}</>;
}
