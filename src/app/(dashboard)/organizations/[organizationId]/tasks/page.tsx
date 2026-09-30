import type { Metadata } from "next";
import { Suspense } from "react";
import MyTasks from "@/components/modules/task/my-tasks";
import MyTasksLoading from "@/components/modules/task/my-tasks-loading";

export const metadata: Metadata = {
  title: "My Tasks — TaskFlow",
  description:
    "Every task assigned to you across this organization, with project and sprint context.",
};

export default async function OrganizationTasksPage({
  params,
}: {
  params: Promise<{ organizationId: string }>;
}) {
  const { organizationId } = await params;

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold tracking-tight">My tasks</h2>
        <p className="text-sm text-muted-foreground">
          Assigned to you across all projects in this organization.
        </p>
      </div>
      <Suspense fallback={<MyTasksLoading />}>
        <MyTasks organizationId={organizationId} />
      </Suspense>
    </div>
  );
}
