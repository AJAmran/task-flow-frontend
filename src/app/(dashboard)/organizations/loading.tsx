import OrganizationListLoading from "@/components/modules/organization/organization-list-loading";

export default function OrganizationsLoading() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">Organizations</h1>
          <p className="text-sm text-muted-foreground">
            Workspaces you own or collaborate in
          </p>
        </div>
      </div>
      <OrganizationListLoading />
    </div>
  );
}
