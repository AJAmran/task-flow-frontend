import type { Metadata } from "next";
import { Suspense } from "react";
import TaskTable from "@/components/modules/task/task-table";
import TaskTableLoading from "@/components/modules/task/task-table-loading";

export const metadata: Metadata = {
  title: "Project Tasks — TaskFlow",
  description:
    "Manage every task in this project. Create with the guided wizard, then filter and sort.",
};

export default async function ProjectTasksPage({
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
