import type { Metadata } from "next";
import { Suspense } from "react";
import AdminOrgsTable, {
  AdminOrgsSkeleton,
} from "@/components/modules/admin/admin-orgs-table";

export const metadata: Metadata = {
  title: "Organizations — TaskFlow Admin",
  description:
    "Every workspace on the platform. Filter by status, suspend or reactivate.",
};

export default function AdminOrganizationsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold tracking-tight">Organizations</h2>
        <p className="text-sm text-muted-foreground">
          Suspended workspaces block member access until reactivated.
        </p>
      </div>
      <Suspense fallback={<AdminOrgsSkeleton />}>
        <AdminOrgsTable />
      </Suspense>
    </div>
  );
}
