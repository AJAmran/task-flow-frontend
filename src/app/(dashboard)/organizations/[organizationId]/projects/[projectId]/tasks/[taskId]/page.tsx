import type { Metadata } from "next";
import { Suspense } from "react";
import TaskDetail from "@/components/modules/task/task-detail";
import TaskDetailLoading from "@/components/modules/task/task-detail-loading";

export const metadata: Metadata = {
  title: "Task — TaskFlow",
  description:
    "Task details with subtasks, discussion, file attachments, assignee, and status.",
};

export default async function ProjectTaskDetailPage({
  params,
}: {
  params: Promise<{
    organizationId: string;
    projectId: string;
    taskId: string;
  }>;
}) {
  const { organizationId, projectId, taskId } = await params;

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
      <Suspense fallback={<TaskDetailLoading />}>
        <TaskDetail
          organizationId={organizationId}
          projectId={projectId}
          taskId={taskId}
        />
      </Suspense>
    </div>
  );
}
