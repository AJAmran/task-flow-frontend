"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import TaskCreateWizard from "@/components/form/task-create-wizard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import { useChangeTaskStatus, useSprints, useTasks } from "@/hooks";
import type { TaskStatus } from "@/types";
import { StatusBadge, TaskCard, statusLabels, taskStatuses } from "./task-shared";
import TaskBoardLoading from "./task-board-loading";

function MoveSelect({
  organizationId,
  projectId,
  taskId,
  status,
}: {
  organizationId: string;
  projectId: string;
  taskId: string;
  status: TaskStatus;
}) {
  const { mutate: move, isPending } = useChangeTaskStatus(
    organizationId,
    projectId,
    true,
  );

  return (
    <Select
      value={status}
      disabled={isPending}
      onValueChange={(val: string | null) => {
        const next = val as TaskStatus | null;
        if (!next || next === status) {
          return;
        }
        move(
          { taskId, status: next },
          {
            onError: (err) => {
              toast.add({
                title: "Move failed",
                description: err.message || "Please try again",
                type: "error",
              });
            },
          },
        );
      }}
    >
      <SelectTrigger
        className="h-7 w-full text-xs"
        aria-label="Move task to another status"
      >
        <StatusBadge status={status} />
      </SelectTrigger>
      <SelectContent>
        {taskStatuses.map((s) => (
          <SelectItem key={s} value={s}>
            {statusLabels[s]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default function TaskBoard({
  organizationId,
  projectId,
}: {
  organizationId: string;
  projectId: string;
}) {
  const [createOpen, setCreateOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sprintId = searchParams.get("sprintId") ?? undefined;

  const { data, isPending, isError, refetch } = useTasks(organizationId, projectId, {
    page: 1,
    limit: 100,
    ...(sprintId && { sprintId }),
    sortBy: "updatedAt",
    sortOrder: "desc",
  });
  const { data: sprintsData } = useSprints(organizationId, projectId, {
    page: 1,
    limit: 100,
  });

  const tasks = data?.data ?? [];
  const sprints = sprintsData?.data ?? [];

  const setSprint = (value?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("sprintId", value);
    } else {
      params.delete("sprintId");
    }
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  if (isPending) {
    return <TaskBoardLoading />;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border p-10 text-center">
        <p className="font-medium">Could not load board</p>
        <Button variant="outline" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Select
          value={sprintId ?? "ALL"}
          onValueChange={(val: string | null) =>
            setSprint(val === "ALL" ? undefined : (val ?? undefined))
          }
        >
          <SelectTrigger className="sm:w-52" aria-label="Filter by sprint">
            <span className="truncate text-sm">
              {sprintId
                ? (sprints.find((s) => s.id === sprintId)?.name ?? "Sprint")
                : "All sprints + backlog"}
            </span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All sprints + backlog</SelectItem>
            {sprints.map((sprint) => (
              <SelectItem key={sprint.id} value={sprint.id}>
                {sprint.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          <Plus /> New task
        </Button>
      </div>

      {tasks.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed px-6 py-12 text-center">
          <p className="font-medium">No tasks yet</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Create your first task to see it move across Todo, In Progress, In
            Review, and Done.
          </p>
          <Button
            className="mt-2"
            size="sm"
            onClick={() => setCreateOpen(true)}
          >
            <Plus /> Create task
          </Button>
        </div>
      ) : (
        <div className="grid items-start gap-4 md:grid-cols-2 xl:grid-cols-4">
          {taskStatuses.map((status) => {
            const column = tasks.filter((t) => t.status === status);
            return (
              <div
                key={status}
                className="flex flex-col gap-2 rounded-xl bg-muted/50 p-2"
              >
                <div className="flex items-center justify-between px-1 pt-1">
                  <StatusBadge status={status} />
                  <span className="text-xs font-medium text-muted-foreground">
                    {column.length}
                  </span>
                </div>
                {column.length === 0 ? (
                  <p className="rounded-lg border border-dashed px-3 py-6 text-center text-xs text-muted-foreground">
                    Empty
                  </p>
                ) : (
                  column.map((task) => (
                    <TaskCard
                      key={task.id}
                      organizationId={organizationId}
                      task={task}
                      actions={
                        <MoveSelect
                          organizationId={organizationId}
                          projectId={projectId}
                          taskId={task.id}
                          status={task.status}
                        />
                      }
                    />
                  ))
                )}
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create a task</DialogTitle>
          </DialogHeader>
          <TaskCreateWizard
            organizationId={organizationId}
            projectId={projectId}
            onSuccess={() => setCreateOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <p className="text-center text-xs text-muted-foreground">
        Tip: open a task for subtasks, comments, and attachments.{" "}
        <Link
          href={`/organizations/${organizationId}/projects/${projectId}/list`}
          className="underline"
        >
          Switch to list view
        </Link>
      </p>
    </div>
  );
}

export function TaskBoardSkeleton() {
  return (
    <div
      className="grid items-start gap-4 md:grid-cols-2 xl:grid-cols-4"
      aria-label="Loading board"
    >
      {taskStatuses.map((status) => (
        <div key={status} className="flex flex-col gap-2 rounded-xl bg-muted/50 p-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
      ))}
    </div>
  );
}
