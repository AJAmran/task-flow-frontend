"use client";

import { format } from "date-fns";
import { Receipt, Wallet } from "lucide-react";
import Link from "next/link";
import UpgradeButtons from "@/components/modules/billing/upgrade-buttons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrganization, useOrganizations, useSubscription } from "@/hooks";
import { cn } from "@/lib/utils";

const planStyles: Record<string, string> = {
  FREE: "bg-muted text-muted-foreground",
  PRO: "bg-cyan-100 text-cyan-900",
  TEAM: "bg-violet-100 text-violet-900",
};

const paymentStyles: Record<string, string> = {
  SUCCESS: "bg-emerald-100 text-emerald-900",
  PENDING: "bg-amber-100 text-amber-900",
  FAILED: "bg-red-100 text-red-900",
  CANCELLED: "bg-muted text-muted-foreground",
};

function OrgBilling({
  organizationId,
  name,
}: {
  organizationId: string;
  name: string;
}) {
  const { data, isPending, isError } = useSubscription(organizationId);
  const { data: orgData } = useOrganization(organizationId);
  const isOwner = orgData?.data?.myRole === "ORG_OWNER";

  if (isPending) {
    return <Skeleton className="h-56 w-full" />;
  }

  if (isError || !data?.data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{name}</CardTitle>
          <CardDescription>Could not load subscription.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const sub = data.data;

  return (
    <Card
      className={cn(
        "flex flex-col border-t-2",
        sub.plan === "FREE"
          ? "border-t-muted-foreground/20"
          : "border-t-teal-500",
      )}
    >
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex size-10 items-center justify-center rounded-lg bg-teal-600/10 text-teal-700">
              <Wallet className="size-5" />
            </span>
            <div>
              <CardTitle className="text-base">{name}</CardTitle>
              <CardDescription>
                {sub.maxProjects} projects · {sub.maxMembers} members
              </CardDescription>
            </div>
          </div>
          <span className="flex gap-1.5">
            <Badge className={cn(planStyles[sub.plan])}>{sub.plan}</Badge>
            <Badge variant="outline">{sub.status.toLowerCase()}</Badge>
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {sub.currentPeriodEnd && sub.plan !== "FREE" && (
          <p className="text-xs text-muted-foreground">
            Renews {format(new Date(sub.currentPeriodEnd), "MMM d, yyyy")}
          </p>
        )}
        {sub.plan === "FREE" && (
          <Button
            size="sm"
            className="w-fit"
            render={<Link href="/pricing">Compare plans</Link>}
          >
            Compare plans
          </Button>
        )}
        {isOwner && (
          <UpgradeButtons
            organizationId={organizationId}
            currentPlan={sub.plan}
          />
        )}
        <div className="flex flex-col gap-2">
          <h4 className="flex items-center gap-1.5 text-sm font-semibold">
            <Receipt className="size-4" /> Payment history
          </h4>
          {sub.payments.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No payments yet. Upgrades appear here with status and date.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {sub.payments.map((payment) => (
                <li
                  key={payment.id}
                  className="flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-sm"
                >
                  <span>
                    <span className="font-medium">
                      ৳{payment.amount} {payment.currency}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {format(new Date(payment.createdAt), "MMM d, yyyy")}
                      {payment.trxID ? ` · ${payment.trxID}` : ""}
                    </span>
                  </span>
                  <Badge className={cn(paymentStyles[payment.status] ?? "")}>
                    {payment.status.toLowerCase()}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function BillingHistorySkeleton() {
  return (
    <div className="grid gap-4 lg:grid-cols-2" aria-label="Loading billing">
      <Skeleton className="h-56 w-full" />
      <Skeleton className="h-56 w-full" />
    </div>
  );
}

export default function BillingHistory() {
  const { data, isPending } = useOrganizations({ page: 1, limit: 50 });
  const memberships = data?.data ?? [];

  if (isPending) {
    return <BillingHistorySkeleton />;
  }

  if (memberships.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed px-6 py-12 text-center">
        <p className="font-medium">No organizations</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          Join or create an organization to see subscriptions and payments.
        </p>
      </div>
    );
  }

  return (
    <div className="grid items-start gap-4 lg:grid-cols-2">
      {memberships.map((m) => (
        <OrgBilling
          key={m.membershipId}
          organizationId={m.organization.id}
          name={m.organization.name}
        />
      ))}
    </div>
  );
}
