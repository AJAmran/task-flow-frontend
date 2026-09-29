"use client";

import { useGetMe } from "@/hooks";
import type { PlatformRole } from "@/types";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect } from "react";
import AccessDenied from "./access-denied";
import AuthLoading from "./auth-loading";

interface IProps {
  children: ReactNode;
  roles: PlatformRole[];
}

export default function RoleGuard({ children, roles }: IProps) {
  const router = useRouter();

  const { data, isPending, isError } = useGetMe();

  const user = data?.data;

  const isAuthorized = !!user && roles.includes(user.platformRole);

  useEffect(() => {
    if (isPending) {
      return;
    }
    if (isError || !user) {
      router.replace("/login");
    }
  }, [isPending, isError, user, router]);

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
