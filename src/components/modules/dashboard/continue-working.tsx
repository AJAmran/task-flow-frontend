"use client";

import { useQueries } from "@tanstack/react-query";
import { isPast } from "date-fns";
import { AlertTriangle, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { getMyAssignedTasks } from "@/api";
import {
  DueBadge,
  PriorityBadge,
  StatusBadge,
} from "@/components/modules/task/task-shared";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrganizations } from "@/hooks";
import type { AssignedTask } from "@/types";

export function ContinueWorkingSkeleton() {
  return (
    <div className="flex flex-col gap-2" role="status" aria-label="Loading continue working">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-16 w-full" />
      ))}
    </div>
  );
}

type TaskWithOrg = AssignedTask & { organizationId: string };

export default function ContinueWorking() {
  const { data: orgsData, isPending: orgsPending } = useOrganizations({
    page: 1,
    limit: 20,
  });
  const orgIds = (orgsData?.data ?? []).map((m) => m.organization.id);

  const results = useQueries({
    queries: orgIds.map((organizationId) => ({
      queryKey: [
        "organizations",
        organizationId,
        "tasks",
        "my-assigned",
        { page: 1, limit: 10 },
      ],
      queryFn: () => getMyAssignedTasks(organizationId, { page: 1, limit: 10 }),
      enabled: !!organizationId,
    })),
  });

  if (orgsPending || results.some((r) => r.isPending)) {
    return <ContinueWorkingSkeleton />;
  }

  const all: TaskWithOrg[] = results.flatMap((r, i) =>
    ((r.data?.data ?? []) as AssignedTask[]).map((task) => ({
      ...task,
      organizationId: orgIds[i],
    })),
  );

  const open = all
    .filter((t) => t.status !== "DONE")
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
  const overdue = open.filter((t) => t.dueDate && isPast(new Date(t.dueDate)));
  const shown = open.slice(0, 6);

  if (all.length === 0) {
    return null;
  }

  if (open.length === 0) {
    return (
      <Card className="border-teal-600/20 bg-teal-50/50">
        <CardContent className="flex items-center gap-3 py-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-teal-600/10">
            <CheckCircle2 className="size-5 text-teal-700" />
          </span>
          <div>
            <p className="text-sm font-semibold">You&apos;re all caught up</p>
            <p className="text-xs text-muted-foreground">
              Every assigned task is done. Pick up something new from a board.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight">
          Continue working
        </h2>
        <Button
          variant="outline"
          size="sm"
          render={<Link href="/dashboard/activity">View all activity</Link>}
        >
          View all <ArrowRight />
        </Button>
      </div>

      {overdue.length > 0 && (
        <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm">
          <AlertTriangle className="size-4 shrink-0 text-amber-600" />
          <p>
            <span className="font-semibold">{overdue.length}</span> overdue task
            {overdue.length === 1 ? "" : "s"} — start here.
          </p>
        </div>
      )}

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Recently updated · {open.length} open
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-1 p-2 pt-0">
          {shown.map((task) => (
            <Link
              key={`${task.organizationId}-${task.id}`}
              href={`/organizations/${task.organizationId}/projects/${task.project.id}/tasks/${task.id}`}
              className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-muted/60"
            >
              <span
                aria-hidden
                className={
                  task.status === "DONE"
                    ? "size-2.5 shrink-0 rounded-full bg-emerald-500"
                    : task.status === "IN_PROGRESS"
                      ? "size-2.5 shrink-0 rounded-full bg-cyan-500"
                      : task.status === "IN_REVIEW"
                        ? "size-2.5 shrink-0 rounded-full bg-amber-500"
                        : "size-2.5 shrink-0 rounded-full bg-muted-foreground/40"
                }
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">
                  {task.title}
                </span>
                <span className="block truncate text-xs text-muted-foreground">
                  {task.project.name}
                  {task.sprint ? ` · ${task.sprint.name}` : ""}
                </span>
              </span>
              <span className="hidden shrink-0 sm:block">
                <DueBadge dueDate={task.dueDate} />
              </span>
              <span className="hidden shrink-0 md:block">
                <PriorityBadge priority={task.priority} />
              </span>
              <span className="shrink-0">
                <StatusBadge status={task.status} />
              </span>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
