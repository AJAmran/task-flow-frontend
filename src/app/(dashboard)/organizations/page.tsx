export default function OrganizationsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">Organizations</h1>
          <p className="text-sm text-muted-foreground">
            Manage your organizations
          </p>
        </div>
        {/* TODO: Add "New Organization" button */}
      </div>
      {/* TODO: Add organizations list */}
    </div>
  );
}
