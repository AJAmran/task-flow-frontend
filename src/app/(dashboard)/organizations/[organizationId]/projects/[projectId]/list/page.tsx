import type { Metadata } from "next";
import { Suspense } from "react";
import TaskTable from "@/components/modules/task/task-table";
import TaskTableLoading from "@/components/modules/task/task-table-loading";

export const metadata: Metadata = {
  title: "Tasks — TaskFlow",
  description:
    "All project tasks in a filterable table. Search, filter by status, priority, or sprint, and sort.",
};

export default async function ProjectListPage({
  params,
}: {
  params: Promise<{ organizationId: string; projectId: string }>;
}) {
  const { organizationId, projectId } = await params;

  return (
    <Suspense fallback={<TaskTableLoading />}>
      <TaskTable organizationId={organizationId} projectId={projectId} />
    </Suspense>
  );
}
