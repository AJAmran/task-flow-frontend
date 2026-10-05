"use client";

import { ArrowRight, Crown } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrganization } from "@/hooks";
import { cn } from "@/lib/utils";

export function isLimitError(err: unknown): boolean {
  const message =
    (err as { data?: { message?: unknown } })?.data?.message ??
    (err instanceof Error ? err.message : "");
  return (
    typeof message === "string" && message.toLowerCase().includes("limit reached")
  );
}

export const LIMIT_UPGRADE_SUFFIX =
  " Open Billing & Payments to upgrade this workspace.";

export default function PlanUsage({
  organizationId,
  type,
}: {
  organizationId: string;
  type: "projects" | "members";
}) {
  const { data, isPending } = useOrganization(organizationId);

  if (isPending) {
    return <Skeleton className="h-12 w-full" aria-label="Loading plan usage" />;
  }

  const detail = data?.data;
  const subscription = detail?.organization.subscription;
  const isOwner = detail?.myRole === "ORG_OWNER";
  if (!detail || !subscription) {
    return null;
  }

  const max =
    type === "projects" ? subscription.maxProjects : subscription.maxMembers;
  const used =
    type === "projects"
      ? (detail.organization._count?.projects ?? 0)
      : (detail.organization._count?.members ?? 0);
  const reached = used >= max;
  const label = type === "projects" ? "projects" : "members";

  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-xl border px-4 py-3 sm:flex-row sm:items-center sm:justify-between",
        reached
          ? "border-amber-300 bg-amber-50"
          : "border-teal-600/20 bg-teal-50/40",
      )}
      role="status"
    >
      <div className="flex flex-col gap-1.5">
        <p className="text-sm">
          <span className="font-bold">
            {used} of {max}
          </span>{" "}
          <span className="text-muted-foreground">
            {label} used on the {subscription.plan} plan
          </span>
        </p>
        <div
          className="h-1.5 w-48 overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-valuenow={used}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={`${label} usage`}
        >
          <div
            className={cn(
              "h-full transition-all",
              reached ? "bg-amber-500" : "bg-teal-500",
            )}
            style={{
              width: `${max > 0 ? Math.min(100, (used / max) * 100) : 0}%`,
            }}
          />
        </div>
      </div>
      {reached ? (
        isOwner ? (
          <Button
            size="sm"
            className="w-fit shrink-0"
            render={
              <Link href="/dashboard/payments">
                Upgrade for more <ArrowRight />
              </Link>
            }
          >
            Upgrade for more <ArrowRight />
          </Button>
        ) : (
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Crown className="size-3.5" />
            Limit reached — ask your workspace owner to upgrade.
          </p>
        )
      ) : (
        isOwner && (
          <Button
            size="sm"
            variant="outline"
            className="w-fit shrink-0"
            render={
              <Link href="/dashboard/payments">
                Manage plan <ArrowRight />
              </Link>
            }
          >
            Manage plan <ArrowRight />
          </Button>
        )
      )}
    </div>
  );
}
