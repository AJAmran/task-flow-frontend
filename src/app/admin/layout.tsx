import RoleGuard from "@/components/auth/role-guard";
import DashboardShell from "@/components/dashboard/dashboard-shell";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard roles={["SUPER_ADMIN"]}>
      <DashboardShell>
        <div className="flex flex-1 flex-col gap-4 p-6">{children}</div>
      </DashboardShell>
    </RoleGuard>
  );
}
