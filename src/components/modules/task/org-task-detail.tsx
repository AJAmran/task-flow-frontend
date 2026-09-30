"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyAssignedTasks } from "@/hooks";
import TaskDetail from "@/components/modules/task/task-detail";
import TaskDetailLoading from "@/components/modules/task/task-detail-loading";

export function OrgTaskDetailSkeleton() {
  return <TaskDetailLoading />;
}

export default function OrgTaskDetail({
  organizationId,
  taskId,
}: {
  organizationId: string;
  taskId: string;
}) {
  const { data, isPending, isError } = useMyAssignedTasks(organizationId, {
    page: 1,
    limit: 100,
  });

  if (isPending) {
    return <TaskDetailLoading />;
  }

  const match = (data?.data ?? []).find((t) => t.id === taskId);

  if (isError || !match) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border p-10 text-center">
        <p className="font-medium">Task not found here</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          This view lists tasks assigned to you. The task may belong to a
          project you cannot access, or it was deleted.
        </p>
        <Button
          variant="outline"
          render={
            <Link href={`/organizations/${organizationId}/tasks`}>
              Back to my tasks
            </Link>
          }
        >
          Back to my tasks
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
      <Button
        variant="link"
        size="sm"
        className="w-fit p-0"
        render={
          <Link href={`/organizations/${organizationId}/tasks`}>
            ← Back to my tasks
          </Link>
        }
      >
        ← Back to my tasks
      </Button>
      <TaskDetail
        organizationId={organizationId}
        projectId={match.project.id}
        taskId={taskId}
      />
    </div>
  );
}

export function OrgTaskDetailFallback() {
  return (
    <div className="flex flex-col gap-4" aria-label="Loading task">
      <Skeleton className="h-7 w-64" />
      <Skeleton className="h-40 w-full" />
    </div>
  );
}
