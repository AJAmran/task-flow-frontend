"use client";

import { formatDistanceToNow } from "date-fns";
import { Activity } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMe, useMyAssignedTasks, useOrganizations } from "@/hooks";
import {
  PriorityBadge,
  StatusBadge,
} from "@/components/modules/task/task-shared";

export function GlobalActivitySkeleton() {
  return (
    <div className="flex flex-col gap-3" aria-label="Loading activity">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-24 w-full" />
      ))}
    </div>
  );
}

function OrgTaskList({ organizationId }: { organizationId: string }) {
  const { data } = useMyAssignedTasks(organizationId, { page: 1, limit: 10 });
  const tasks = data?.data ?? [];

  return (
    <>
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
              href={`/organizations/${organizationId}/projects/${task.project.id}/tasks/${task.id}`}
              className="w-fit text-sm font-medium hover:underline"
            >
              {task.title}
            </Link>
            <p className="text-xs text-muted-foreground">
              {task.project.name}
              {task.sprint ? ` · ${task.sprint.name}` : ""}
            </p>
          </div>
        </li>
      ))}
    </>
  );
}

export default function GlobalActivity() {
  const { data: meData } = useGetMe();
  const { data: orgsData, isPending } = useOrganizations({
    page: 1,
    limit: 50,
  });
  const orgIds = (orgsData?.data ?? []).map((m) => m.organization.id);

  if (isPending) {
    return <GlobalActivitySkeleton />;
  }

  if (orgIds.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed px-6 py-12 text-center">
        <span className="rounded-full bg-muted p-3">
          <Activity className="size-5 text-muted-foreground" />
        </span>
        <p className="font-medium">No activity yet</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          {meData?.data
            ? `Hi ${meData.data.name.split(" ")[0]} — tasks assigned to you across all workspaces will appear here.`
            : "Tasks assigned to you across all workspaces will appear here."}
        </p>
        <Button
          className="mt-2"
          size="sm"
          render={<Link href="/organizations">Browse organizations</Link>}
        >
          Browse organizations
        </Button>
      </div>
    );
  }

  return (
    <ol className="relative flex flex-col gap-0 border-l-2 border-muted pl-0">
      {orgIds.map((orgId) => (
        <OrgTaskList key={orgId} organizationId={orgId} />
      ))}
    </ol>
  );
}
