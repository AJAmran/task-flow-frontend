"use client";

import { ArrowRight, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrganization } from "@/hooks";

export default function NewProjectButton({
  organizationId,
}: {
  organizationId: string;
}) {
  const { data, isPending } = useOrganization(organizationId);

  if (isPending) {
    return <Skeleton className="h-8 w-32" aria-label="Loading" />;
  }

  const detail = data?.data;
  const max = detail?.organization.subscription?.maxProjects;
  const used = detail?.organization._count?.projects ?? 0;
  const isOwner = detail?.myRole === "ORG_OWNER";
  const reached = max !== undefined && used >= max;

  if (reached) {
    return isOwner ? (
      <Button
        size="sm"
        render={
          <Link href="/dashboard/payments">
            Upgrade for more <ArrowRight />
          </Link>
        }
      >
        Upgrade for more <ArrowRight />
      </Button>
    ) : (
      <Button size="sm" disabled title="Project limit reached for this plan">
        <Plus /> New project
      </Button>
    );
  }

  return (
    <Button
      render={
        <Link href={`/organizations/${organizationId}/projects/new`}>
          <Plus /> New project
        </Link>
      }
    >
      <Plus /> New project
    </Button>
  );
}
