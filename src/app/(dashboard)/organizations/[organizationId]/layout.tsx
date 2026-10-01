"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { use } from "react";
import AuthGuard from "@/components/auth/auth-guard";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrganization } from "@/hooks";
import { cn } from "@/lib/utils";

function OrgNav({ organizationId }: { organizationId: string }) {
  const pathname = usePathname();
  const { data, isPending } = useOrganization(organizationId);

  const base = `/organizations/${organizationId}`;
  const tabs = [
    { title: "Overview", url: base },
    { title: "Members", url: `${base}/members` },
    { title: "Teams", url: `${base}/teams` },
    { title: "Projects", url: `${base}/projects` },
    { title: "Tasks", url: `${base}/tasks` },
  ];

  return (
    <div className="flex flex-col gap-4 border-b px-6 pt-6">
      <div className="flex flex-col gap-2">
        <Link
          href="/organizations"
          className="flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> All workspaces
        </Link>
        {isPending ? (
          <Skeleton className="h-7 w-48" />
        ) : (
          <h1 className="text-2xl font-bold tracking-tight">
            {data?.data?.organization?.name ?? "Organization"}
          </h1>
        )}
      </div>
      <nav className="flex gap-1 overflow-x-auto" aria-label="Organization">
        {tabs.map((tab) => {
          const active =
            tab.url === base
              ? pathname === base
              : pathname === tab.url || pathname.startsWith(`${tab.url}/`);

          return (
            <Link
              key={tab.title}
              href={tab.url}
              aria-current={active ? "page" : undefined}
              className={cn(
                "rounded-t-lg border-b-2 px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors",
                active
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {tab.title}
            </Link>
          );
        })}
      </nav>
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
        <OrgNav organizationId={organizationId} />
        <div className="flex flex-1 flex-col gap-4 p-6">{children}</div>
      </div>
    </AuthGuard>
  );
}
