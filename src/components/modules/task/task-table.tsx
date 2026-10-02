"use client";

import { format } from "date-fns";
import { Plus, SearchX } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import TaskCreateWizard from "@/components/form/task-create-wizard";
import AvatarInitials from "@/components/ui/avatar-initials";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TablePagination from "@/components/ui/table-pagination";
import { useSprints, useTasks } from "@/hooks";
import useDebounce from "@/hooks/debounce.hook";
import type { TaskPriority, TaskSortBy, TaskStatus } from "@/types";
import { DueBadge, PriorityBadge, StatusBadge } from "./task-shared";
import TaskTableLoading from "./task-table-loading";

const PAGE_SIZE = 10;

const sortOptions: {
  value: `${TaskSortBy}:${"asc" | "desc"}`;
  label: string;
}[] = [
  { value: "updatedAt:desc", label: "Recently updated" },
  { value: "createdAt:desc", label: "Newest first" },
  { value: "createdAt:asc", label: "Oldest first" },
  { value: "dueDate:asc", label: "Due date (soonest)" },
  { value: "dueDate:desc", label: "Due date (latest)" },
];

export default function TaskTable({
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

  const pageParam = Number(searchParams.get("page") ?? "1");
  const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
  const statusParam = searchParams.get("status");
  const status = (
    ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"] as TaskStatus[]
  ).includes(statusParam as TaskStatus)
    ? (statusParam as TaskStatus)
    : undefined;
  const priorityParam = searchParams.get("priority");
  const priority = (
    ["LOW", "MEDIUM", "HIGH", "URGENT"] as TaskPriority[]
  ).includes(priorityParam as TaskPriority)
    ? (priorityParam as TaskPriority)
    : undefined;
  const sprintId = searchParams.get("sprintId") ?? undefined;
  const sortValue = searchParams.get("sort") ?? "updatedAt:desc";
  const [sortBy, sortOrder] = (
    sortOptions.some((o) => o.value === sortValue)
      ? sortValue
      : "updatedAt:desc"
  ).split(":") as [TaskSortBy, "asc" | "desc"];
  const urlQ = searchParams.get("q") ?? "";

  const [searchInput, setSearchInput] = useState(urlQ);
  const debouncedQ = useDebounce(searchInput);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const current = params.get("q") ?? "";
    if (debouncedQ === current) {
      return;
    }
    if (debouncedQ.trim()) {
      params.set("q", debouncedQ.trim());
    } else {
      params.delete("q");
    }
    params.delete("page");
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [debouncedQ, pathname, router, searchParams]);

  const setParam = (key: string, value?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const setPage = (next: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (next <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(next));
    }
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const { data, isPending, isError, refetch } = useTasks(
    organizationId,
    projectId,
    {
      page,
      limit: PAGE_SIZE,
      ...(status && { status }),
      ...(priority && { priority }),
      ...(sprintId && { sprintId }),
      ...(debouncedQ.trim() && { q: debouncedQ.trim() }),
      sortBy,
      sortOrder,
    },
  );
  const { data: sprintsData } = useSprints(organizationId, projectId, {
    page: 1,
    limit: 100,
  });

  const tasks = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 0;
  const total = data?.meta?.total ?? 0;
  const sprints = sprintsData?.data ?? [];

  if (isPending) {
    return <TaskTableLoading />;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border p-10 text-center">
        <p className="font-medium">Could not load tasks</p>
        <Button variant="outline" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          <Input
            type="search"
            placeholder="Search title or description..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="sm:max-w-56"
            aria-label="Search tasks"
          />
          <Select
            value={status ?? "ALL"}
            onValueChange={(val: string | null) =>
              setParam("status", val === "ALL" ? undefined : (val ?? undefined))
            }
          >
            <SelectTrigger className="w-36" aria-label="Filter by status">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All status</SelectItem>
              <SelectItem value="TODO">Todo</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="IN_REVIEW">In Review</SelectItem>
              <SelectItem value="DONE">Done</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={priority ?? "ALL"}
            onValueChange={(val: string | null) =>
              setParam(
                "priority",
                val === "ALL" ? undefined : (val ?? undefined),
              )
            }
          >
            <SelectTrigger className="w-32" aria-label="Filter by priority">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All priorities</SelectItem>
              <SelectItem value="LOW">Low</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
              <SelectItem value="URGENT">Urgent</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={sprintId ?? "ALL"}
            onValueChange={(val: string | null) =>
              setParam(
                "sprintId",
                val === "ALL" ? undefined : (val ?? undefined),
              )
            }
          >
            <SelectTrigger className="w-40" aria-label="Filter by sprint">
              <SelectValue placeholder="Sprint" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All sprints</SelectItem>
              {sprints.map((sprint) => (
                <SelectItem key={sprint.id} value={sprint.id}>
                  {sprint.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={`${sortBy}:${sortOrder}`}
            onValueChange={(val: string | null) => {
              const [by, order] = (val ?? "updatedAt:desc").split(":");
              const params = new URLSearchParams(searchParams.toString());
              params.set("sort", `${by}:${order}`);
              params.delete("page");
              const query = params.toString();
              router.push(query ? `${pathname}?${query}` : pathname, {
                scroll: false,
              });
            }}
          >
            <SelectTrigger className="w-44" aria-label="Sort tasks">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button size="sm" className="w-fit" onClick={() => setCreateOpen(true)}>
          <Plus /> New task
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">
        {total} task{total === 1 ? "" : "s"}
      </p>

      {tasks.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed px-6 py-12 text-center">
          <span className="rounded-full bg-muted p-3">
            <SearchX className="size-5 text-muted-foreground" />
          </span>
          <p className="font-medium">No tasks match</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Try different filters, or create a task to get started.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Task</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead className="hidden md:table-cell">Assignee</TableHead>
                <TableHead className="hidden lg:table-cell">Due</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>
                    <Link
                      href={`/organizations/${organizationId}/projects/${projectId}/tasks/${task.id}`}
                      className="block max-w-64 truncate font-medium hover:underline"
                    >
                      {task.title}
                    </Link>
                    {task.sprint && (
                      <span className="block truncate text-xs text-muted-foreground">
                        {task.sprint.name}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={task.status} />
                  </TableCell>
                  <TableCell>
                    <PriorityBadge priority={task.priority} />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {task.assignee ? (
                      <span className="flex items-center gap-2">
                        <AvatarInitials name={task.assignee.name} size="sm" />
                        <span className="max-w-28 truncate text-sm">
                          {task.assignee.name}
                        </span>
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {task.dueDate ? (
                      <DueBadge dueDate={task.dueDate} />
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                    {task.dueDate && (
                      <span className="block text-xs text-muted-foreground">
                        {format(new Date(task.dueDate), "MMM d, yyyy")}
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {totalPages > 1 && (
        <TablePagination
          page={page}
          totalPages={totalPages}
          handlePageChange={(next) =>
            setPage(typeof next === "function" ? next(page) : next)
          }
        />
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
    </div>
  );
}
