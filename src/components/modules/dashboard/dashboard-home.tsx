"use client";

import { format } from "date-fns";
import {
  ArrowRight,
  Building2,
  Crown,
  FolderKanban,
  Plus,
  ShieldCheck,
  User,
  UserPlus,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMe, useOrganizations } from "@/hooks";
import { cn } from "@/lib/utils";
import ContinueWorking from "./continue-working";
import GettingStartedChecklist from "./getting-started-checklist";

export function DashboardHomeLoading() {
  return (
    <div className="flex flex-col gap-4 p-6" aria-label="Loading dashboard">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-96" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-40" />
        ))}
      </div>
    </div>
  );
}

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) {
    return "Good morning";
  }
  if (hour < 17) {
    return "Good afternoon";
  }
  return "Good evening";
}

const onboardingSteps = [
  {
    step: "1",
    icon: Building2,
    title: "Create a workspace",
    description: "A workspace for your company, client, or crew.",
    cta: "Create workspace",
    href: "/organizations/new",
  },
  {
    step: "2",
    icon: UserPlus,
    title: "Invite your team",
    description:
      "Open your organization, go to the Members tab, and add people by email.",
    cta: "Go to workspaces",
    href: "/organizations",
  },
  {
    step: "3",
    icon: FolderKanban,
    title: "Start a project",
    description: "Plan sprints and track tasks on the board.",
    cta: "Go to workspaces",
    href: "/organizations",
  },
];

export default function DashboardHome() {
  const { data: meData } = useGetMe();
  const { data: orgsData, isPending } = useOrganizations({
    page: 1,
    limit: 6,
  });

  const user = meData?.data;
  const memberships = orgsData?.data ?? [];
  const total = orgsData?.meta?.total ?? 0;
  const ownedCount = memberships.filter((m) => m.role === "ORG_OWNER").length;
  const memberCount = memberships.length - ownedCount;
  const isAdmin = user?.platformRole === "SUPER_ADMIN";

  const statStrip = [
    { label: "Workspaces", value: total, icon: Building2 },
    { label: "Owned by you", value: ownedCount, icon: Crown },
    { label: "Member of", value: memberCount, icon: User },
  ];

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="relative overflow-hidden rounded-2xl bg-[#0a2e36] px-6 py-6 sm:px-8">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(45,212,191,0.3),transparent_50%),radial-gradient(circle_at_10%_90%,rgba(45,212,191,0.15),transparent_45%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.12] bg-[radial-gradient(rgba(255,255,255,0.8)_1px,transparent_1px)] bg-[size:20px_20px]"
        />
        <div className="relative flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              {greeting()}
              {user ? `, ${user.name.split(" ")[0]}` : ""}
            </h1>
            {user && (
              <Badge
                variant="secondary"
                className="border-teal-100/20 bg-white/10 text-teal-50"
              >
                {isAdmin ? (
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="size-3" /> Admin
                  </span>
                ) : (
                  "Member"
                )}
              </Badge>
            )}
          </div>
          <p className="text-sm text-teal-100/80">
            {format(new Date(), "EEEE, MMMM d")} ·{" "}
            {isAdmin
              ? "Govern the platform from the Admin area, or collaborate in your own workspaces below."
              : "Pick up where you left off, or jump into a workspace."}
          </p>
          {isAdmin && (
            <Button
              size="sm"
              className="mt-1 w-fit bg-teal-300 text-teal-950 hover:bg-teal-200"
              nativeButton={false}
              render={
                <Link href="/admin">
                  Open admin area <ArrowRight />
                </Link>
              }
            >
              Open admin area <ArrowRight />
            </Button>
          )}
        </div>
      </div>

      {isPending ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      ) : total === 0 ? (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>Welcome to TaskFlow — let&apos;s set you up</CardTitle>
            <CardDescription>
              Three small steps and your team will be shipping. It takes about
              two minutes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="grid gap-3 md:grid-cols-3">
              {onboardingSteps.map((item) => {
                const Icon = item.icon;
                return (
                  <li
                    key={item.step}
                    className="flex flex-col gap-2 rounded-xl border bg-muted/30 p-4"
                  >
                    <span className="flex items-center gap-2">
                      <span className="flex size-8 items-center justify-center rounded-lg bg-background font-bold text-sm">
                        {item.step}
                      </span>
                      <Icon className="size-4 text-muted-foreground" />
                    </span>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto w-fit p-0"
                      nativeButton={false}
                      render={<Link href={item.cta}>{item.cta}</Link>}
                    >
                      {item.cta}
                    </Button>
                  </li>
                );
              })}
            </ol>
          </CardContent>
        </Card>
      ) : (
        <>
          <ContinueWorking />
          {memberships[0] && (
            <GettingStartedChecklist
              organizationId={memberships[0].organization.id}
              organizationName={memberships[0].organization.name}
            />
          )}
          <div className="grid gap-3 sm:grid-cols-3">
            {statStrip.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="flex items-center gap-3 rounded-xl border bg-card p-4 shadow-sm"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-teal-600/10 text-teal-700">
                    <Icon className="size-5" />
                  </span>
                  <span>
                    <span className="block text-xl font-bold leading-none">
                      {stat.value}
                    </span>
                    <span className="mt-1 block text-xs text-muted-foreground">
                      {stat.label}
                    </span>
                  </span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">
              Your workspaces ({total})
            </h2>
            <Button
              variant="outline"
              size="sm"
              nativeButton={false}
              render={
                <Link href="/organizations">
                  View all <ArrowRight />
                </Link>
              }
            >
              View all <ArrowRight />
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {memberships.map((membership) => {
              const org = membership.organization;
              const isOwner = membership.role === "ORG_OWNER";
              return (
                <Card
                  key={membership.membershipId}
                  className={cn(
                    "flex flex-col border-t-2 transition-all hover:-translate-y-0.5 hover:shadow-md",
                    isOwner
                      ? "border-t-teal-500"
                      : "border-t-muted-foreground/20",
                  )}
                >
                  {" "}
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <span
                        className={cn(
                          "flex size-10 items-center justify-center rounded-lg",
                          isOwner
                            ? "bg-teal-600/10 text-teal-700"
                            : "bg-muted text-muted-foreground",
                        )}
                      >
                        <Building2 className="size-5" />
                      </span>
                      <Badge
                        variant={isOwner ? "default" : "secondary"}
                        className={cn("gap-1")}
                      >
                        {isOwner ? (
                          <Crown className="size-3" />
                        ) : (
                          <User className="size-3" />
                        )}
                        {isOwner ? "Owner" : "Member"}
                      </Badge>
                    </div>
                    <CardTitle className="line-clamp-1">{org.name}</CardTitle>
                    <CardDescription className="font-mono text-xs">
                      /{org.slug}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="mt-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      nativeButton={false}
                      render={
                        <Link href={`/organizations/${org.id}`}>Open</Link>
                      }
                    >
                      Open
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </>
      )}

      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          nativeButton={false}
          render={
            <Link href="/organizations/new">
              <Plus /> New workspace
            </Link>
          }
        >
          <Plus /> New workspace
        </Button>
        <Button
          size="sm"
          variant="outline"
          nativeButton={false}
          render={
            <Link href="/pricing">
              <Wallet /> Compare plans
            </Link>
          }
        >
          <Wallet /> Compare plans
        </Button>
      </div>
    </div>
  );
}
