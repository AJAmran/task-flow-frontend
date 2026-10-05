"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { useGetMe } from "@/hooks";
import { clearSession } from "@/lib/session";
import type { PlatformRole } from "@/types";
import AccessDenied from "./access-denied";
import AuthLoading from "./auth-loading";

interface IProps {
  children: ReactNode;
  roles: PlatformRole[];
}

export default function RoleGuard({ children, roles }: IProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isPending, isError } = useGetMe();

  const user = data?.data;

  const isAuthorized = !!user && roles.includes(user.platformRole);

  useEffect(() => {
    if (isPending) {
      return;
    }
    if (isError || !user) {
      clearSession();
      queryClient.clear();
      const dest =
        typeof window !== "undefined"
          ? window.location.pathname + window.location.search
          : "/login";
      router.replace(`/login?callbackUrl=${encodeURIComponent(dest)}`);
    }
  }, [isPending, isError, user, router, queryClient]);

  if (isPending) {
    return <AuthLoading />;
  }

  if (isError || !user) {
    return <AuthLoading label="Redirecting..." />;
  }

  if (isAuthorized) {
    return <>{children}</>;
  }

  return <AccessDenied />;
}
