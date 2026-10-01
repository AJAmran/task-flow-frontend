import type { Metadata } from "next";
import { Suspense } from "react";
import AdminUsersTable, {
  AdminUsersSkeleton,
} from "@/components/modules/admin/admin-users-table";

export const metadata: Metadata = {
  title: "Users — TaskFlow Admin",
  description:
    "All platform users. Search, filter by role and status, block or unblock accounts.",
};

export default function AdminUsersPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold tracking-tight">Users</h2>
        <p className="text-sm text-muted-foreground">
          Super admin accounts are protected and cannot be blocked.
        </p>
      </div>
      <Suspense fallback={<AdminUsersSkeleton />}>
        <AdminUsersTable />
      </Suspense>
    </div>
  );
}
