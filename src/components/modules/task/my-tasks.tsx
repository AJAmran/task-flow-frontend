"use client";

import { ClipboardList } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import TablePagination from "@/components/ui/table-pagination";
import { useMyAssignedTasks } from "@/hooks";
import MyTasksLoading from "./my-tasks-loading";
import { DueBadge, PriorityBadge, StatusBadge } from "./task-shared";

const PAGE_SIZE = 20;

export default function MyTasks({
  organizationId,
}: {
  organizationId: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pageParam = Number(searchParams.get("myTasksPage") ?? "1");
  const page =
    Number.isFinite(pageParam) && pageParam > 0 ? Math.floor(pageParam) : 1;
  const setPage = (next: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (next <= 1) {
      params.delete("myTasksPage");
    } else {
      params.set("myTasksPage", String(next));
    }
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const { data, isPending, isError, refetch } = useMyAssignedTasks(
    organizationId,
    { page, limit: PAGE_SIZE },
  );

  const tasks = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 0;
  const total = data?.meta?.total ?? 0;

  if (isPending) {
    return <MyTasksLoading />;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border p-10 text-center">
        <p className="font-medium">Could not load your tasks</p>
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
          <ClipboardList className="size-5 text-muted-foreground" />
        </span>
        <p className="font-medium">Nothing assigned to you</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          Tasks assigned to you in any project of this organization will show up
          here.
        </p>
      </div>
    );
  }

  const open = tasks.filter((t) => t.status !== "DONE").length;

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        {open} open · {total} total assigned
      </p>
      <ul className="flex flex-col gap-2">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="flex items-center gap-3 rounded-xl border bg-card px-4 py-3 shadow-sm transition-all hover:shadow-md"
          >
            <span className="flex min-w-0 flex-1 flex-col gap-1">
              <Link
                href={`/organizations/${organizationId}/projects/${task.project.id}/tasks/${task.id}`}
                className="truncate text-sm font-medium hover:underline"
              >
                {task.title}
              </Link>
              <span className="truncate text-xs text-muted-foreground">
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
          </li>
        ))}
      </ul>
      {totalPages > 1 && (
        <TablePagination
          page={page}
          totalPages={totalPages}
          handlePageChange={(next) =>
            setPage(typeof next === "function" ? next(page) : next)
          }
        />
      )}
    </div>
  );
}

export function MyTasksSkeleton() {
  return (
    <div className="flex flex-col gap-2" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-16 w-full" />
      ))}
    </div>
  );
}
