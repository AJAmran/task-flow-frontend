"use client";

import { formatDistanceToNow } from "date-fns";
import { Activity } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useTasks } from "@/hooks";
import AvatarInitials from "@/components/ui/avatar-initials";
import { PriorityBadge, StatusBadge } from "./task-shared";
import ActivityFeedLoading from "./activity-feed-loading";

export default function ActivityFeed({
  organizationId,
  projectId,
}: {
  organizationId: string;
  projectId: string;
}) {
  const { data, isPending, isError, refetch } = useTasks(
    organizationId,
    projectId,
    { page: 1, limit: 30, sortBy: "updatedAt", sortOrder: "desc" },
  );

  const tasks = data?.data ?? [];

  if (isPending) {
    return <ActivityFeedLoading />;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border p-10 text-center">
        <p className="font-medium">Could not load activity</p>
        <Button variant="outline" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed px-6 py-12 text-center">
        <span className="rounded-full bg-muted p-3">
          <Activity className="size-5 text-muted-foreground" />
        </span>
        <p className="font-medium">No activity yet</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          Create tasks and move them across the board — the latest updates
          will appear here.
        </p>
      </div>
    );
  }

  return (
    <ol className="relative flex flex-col gap-0 border-l-2 border-muted pl-0">
      {tasks.map((task) => (
        <li key={task.id} className="relative flex gap-3 pb-5 pl-5 last:pb-0">
          <span
            aria-hidden
            className="absolute top-1 -left-[7px] size-3 rounded-full border-2 border-background bg-teal-500"
          />
          <div className="flex min-w-0 flex-1 flex-col gap-1.5 rounded-xl border bg-card p-3">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={task.status} />
              <PriorityBadge priority={task.priority} />
              <span className="ml-auto text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(task.updatedAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
            <Link
              href={`/organizations/${organizationId}/projects/${projectId}/tasks/${task.id}`}
              className="w-fit text-sm font-medium hover:underline"
            >
              {task.title}
            </Link>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              {task.assignee ? (
                <span className="flex items-center gap-1.5">
                  <AvatarInitials name={task.assignee.name} size="sm" />
                  {task.assignee.name}
                </span>
              ) : (
                <span>Unassigned</span>
              )}
              {task.sprint && <span>{task.sprint.name}</span>}
              {(task._count?.comments ?? 0) > 0 && (
                <span>
                  {task._count?.comments} comment
                  {(task._count?.comments ?? 0) === 1 ? "" : "s"}
                </span>
              )}
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function ActivityFeedSkeleton() {
  return (
    <div className="flex flex-col gap-3" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-24 w-full" />
      ))}
    </div>
  );
}
