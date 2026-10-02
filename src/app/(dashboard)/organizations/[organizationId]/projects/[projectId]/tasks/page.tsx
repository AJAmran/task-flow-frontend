import type { Metadata } from "next";
import TasksHub from "@/components/modules/task/tasks-hub";

export const metadata: Metadata = {
  title: "Project Tasks — TaskFlow",
  description:
    "Manage every task in this project. Switch between board, list, and calendar views.",
};

export default async function ProjectTasksPage({
  params,
}: {
  params: Promise<{ organizationId: string; projectId: string }>;
}) {
  const { organizationId, projectId } = await params;

  return <TasksHub organizationId={organizationId} projectId={projectId} />;
}
