import AuthGuard from "@/components/auth/auth-guard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex min-h-svh flex-col">
        <main className="flex flex-1 flex-col">{children}</main>
      </div>
    </AuthGuard>
  );
}
