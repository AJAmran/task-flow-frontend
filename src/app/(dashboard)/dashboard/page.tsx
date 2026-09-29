export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Welcome to TaskFlow. Select an organization to get started.
        </p>
      </div>
      {/* TODO: Add dashboard widgets/overview */}
    </div>
  );
}
