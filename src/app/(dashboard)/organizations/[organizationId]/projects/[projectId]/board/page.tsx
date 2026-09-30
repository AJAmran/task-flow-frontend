import type { Metadata } from "next";
import { Suspense } from "react";
import TaskBoard from "@/components/modules/task/task-board";
import TaskBoardLoading from "@/components/modules/task/task-board-loading";

export const metadata: Metadata = {
  title: "Board — TaskFlow",
  description:
    "Kanban board. Move tasks across Todo, In Progress, In Review, and Done.",
};

export default async function ProjectBoardPage({
  params,
}: {
  params: Promise<{ organizationId: string; projectId: string }>;
}) {
  const { organizationId, projectId } = await params;

  return (
    <Suspense fallback={<TaskBoardLoading />}>
      <TaskBoard organizationId={organizationId} projectId={projectId} />
    </Suspense>
  );
}
