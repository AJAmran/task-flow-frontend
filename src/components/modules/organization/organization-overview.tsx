"use client";

import { Building2, Crown, FolderKanban, Settings, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import UpdateOrganizationForm from "@/components/form/update-organization-form";
import AvatarInitials from "@/components/ui/avatar-initials";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMe, useOrganization } from "@/hooks";

export function OrganizationOverviewSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          "overview-skeleton-1",
          "overview-skeleton-2",
          "overview-skeleton-3",
        ].map((id) => (
          <div key={id} className="rounded-xl border p-5">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="mt-2 h-8 w-12" />
          </div>
        ))}
      </div>
      <Skeleton className="h-48 w-full rounded-xl" />
    </div>
  );
}

export default function OrganizationOverview({
  organizationId,
}: {
  organizationId: string;
}) {
  const [editOpen, setEditOpen] = useState(false);
  const { data, isPending, isError, refetch } = useOrganization(organizationId);
  const { data: meData } = useGetMe();

  if (isPending) {
    return <OrganizationOverviewSkeleton />;
  }

  if (isError || !data?.data) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border p-10 text-center">
        <p className="font-medium">Could not load this organization</p>
        <p className="text-sm text-muted-foreground">
          You may not be a member, or it may have been removed.
        </p>
        <Button variant="outline" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  const { organization, myRole } = data.data;
  const isOwner = myRole === "ORG_OWNER";
  const counts = organization._count;

  const stats = [
    {
      label: "Members",
      value: counts?.members ?? 0,
      icon: Users,
      href: `/organizations/${organizationId}/people`,
      hint: "Invite & manage",
    },
    {
      label: "Teams",
      value: counts?.teams ?? 0,
      icon: Building2,
      href: `/organizations/${organizationId}/people`,
      hint: "View teams",
    },
    {
      label: "Projects",
      value: counts?.projects ?? 0,
      icon: FolderKanban,
      href: `/organizations/${organizationId}/projects`,
      hint: "View projects",
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <Card className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal-500 via-cyan-400 to-teal-500"
        />
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <AvatarInitials name={organization.name} size="lg" />
              <div>
                <CardTitle className="text-xl">{organization.name}</CardTitle>
                <CardDescription className="font-mono text-xs">
                  /{organization.slug} · {organization.status}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={isOwner ? "default" : "secondary"}>
                {isOwner ? (
                  <span className="flex items-center gap-1">
                    <Crown className="size-3" /> Owner
                  </span>
                ) : (
                  "Member"
                )}
              </Badge>
              {organization.subscription && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-6 uppercase"
                  render={
                    <Link href="/dashboard/payments">
                      {organization.subscription.plan}
                    </Link>
                  }
                >
                  {organization.subscription.plan}
                </Button>
              )}
              {isOwner && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditOpen(true)}
                >
                  <Settings /> Edit
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        {organization.owner && (
          <CardContent className="text-sm text-muted-foreground">
            Owned by {organization.owner.name} ({organization.owner.email})
            {meData?.data && (
              <>
                {" · "}Signed in as {meData.data.name}
              </>
            )}
          </CardContent>
        )}
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className="transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <span className="flex size-8 items-center justify-center rounded-lg bg-teal-600/10 text-teal-700">
                <stat.icon className="size-4" />
              </span>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stat.value}</p>
              <Button
                variant="link"
                size="sm"
                className="h-auto p-0"
                nativeButton={false}
                render={<Link href={stat.href}>{stat.hint}</Link>}
              >
                {stat.hint}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit organization</DialogTitle>
          </DialogHeader>
          <UpdateOrganizationForm
            organizationId={organizationId}
            initialName={organization.name}
            initialSlug={organization.slug}
            onSuccess={() => setEditOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
