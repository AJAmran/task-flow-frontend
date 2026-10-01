import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
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
      <Link
        href={`/organizations/${organizationId}/projects/${projectId}/board`}
        className="flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to board
      </Link>
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
