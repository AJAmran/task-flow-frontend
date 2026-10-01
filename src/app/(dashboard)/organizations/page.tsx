import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import OrganizationList from "@/components/modules/organization/organization-list";
import OrganizationListLoading from "@/components/modules/organization/organization-list-loading";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Workspaces — TaskFlow",
  description:
    "View and manage your workspaces. Create one, invite members and start shipping.",
};

export default function OrganizationsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">Workspaces</h1>
          <p className="text-sm text-muted-foreground">
            Workspaces you own or collaborate in
          </p>
        </div>
        <Button
          nativeButton={false}
          render={<Link href="/organizations/new">New workspace</Link>}
        >
          <Plus /> New workspace
        </Button>
      </div>
      <Suspense fallback={<OrganizationListLoading />}>
        <OrganizationList />
      </Suspense>
    </div>
  );
}
