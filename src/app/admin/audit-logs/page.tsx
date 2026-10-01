import type { Metadata } from "next";
import { Suspense } from "react";
import AuditLogsTable, {
  AuditLogsSkeleton,
} from "@/components/modules/admin/audit-logs-table";

export const metadata: Metadata = {
  title: "Audit Logs — TaskFlow Admin",
  description:
    "Platform activity trail. Filter by action and date range for reviews.",
};

export default function AdminAuditLogsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold tracking-tight">Audit logs</h2>
        <p className="text-sm text-muted-foreground">
          Task updates, invites, billing, and moderation — who did what, when.
        </p>
      </div>
      <Suspense fallback={<AuditLogsSkeleton />}>
        <AuditLogsTable />
      </Suspense>
    </div>
  );
}
