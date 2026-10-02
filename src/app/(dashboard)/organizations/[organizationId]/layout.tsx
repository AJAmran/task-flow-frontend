"use client";

import { use } from "react";
import AuthGuard from "@/components/auth/auth-guard";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrganization } from "@/hooks";
import AvatarInitials from "@/components/ui/avatar-initials";

function OrgHeader({ organizationId }: { organizationId: string }) {
  const { data, isPending } = useOrganization(organizationId);
  const name = data?.data?.organization?.name;

  return (
    <div className="flex items-center gap-3 border-b px-6 py-4">
      {isPending || !name ? (
        <>
          <Skeleton className="size-10 rounded-full" />
          <Skeleton className="h-6 w-48" />
        </>
      ) : (
        <>
          <AvatarInitials name={name} />
          <h1 className="truncate text-xl font-bold tracking-tight">{name}</h1>
        </>
      )}
    </div>
  );
}

export default function OrganizationLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ organizationId: string }>;
}) {
  const { organizationId } = use(params);

  return (
    <AuthGuard>
      <div className="flex flex-1 flex-col">
        <OrgHeader organizationId={organizationId} />
        <div className="flex flex-1 flex-col gap-4 p-6">{children}</div>
      </div>
    </AuthGuard>
  );
}
