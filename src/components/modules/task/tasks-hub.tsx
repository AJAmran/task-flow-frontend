"use client";

import { CalendarDays, KanbanSquare, List } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import TaskBoard from "@/components/modules/task/task-board";
import TaskBoardLoading from "@/components/modules/task/task-board-loading";
import TaskCalendar from "@/components/modules/task/task-calendar";
import TaskCalendarLoading from "@/components/modules/task/task-calendar-loading";
import TaskTable from "@/components/modules/task/task-table";
import TaskTableLoading from "@/components/modules/task/task-table-loading";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import { cn } from "@/lib/utils";

export type TaskView = "board" | "list" | "calendar";

const views: { value: TaskView; label: string; icon: typeof List }[] = [
  { value: "board", label: "Board", icon: KanbanSquare },
  { value: "list", label: "List", icon: List },
  { value: "calendar", label: "Calendar", icon: CalendarDays },
];

function TasksHubContent({
  organizationId,
  projectId,
}: {
  organizationId: string;
  projectId: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const viewParam = searchParams.get("view");
  const view: TaskView = views.some((v) => v.value === viewParam)
    ? (viewParam as TaskView)
    : "board";

  const setView = (next: TaskView) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", next);
    params.delete("page");
    const query = params.toString();
    router.push(`${pathname}?${query}`, { scroll: false });
  };

  return (
    <div className="flex flex-col gap-4">
      <div
        className="flex w-fit items-center gap-1 rounded-xl border bg-muted/50 p-1"
        role="group"
        aria-label="Task views"
      >
        {views.map((item) => {
          const Icon = item.icon;
          const active = view === item.value;
          return (
            <Button
              key={item.value}
              variant="ghost"
              size="sm"
              aria-pressed={active}
              onClick={() => setView(item.value)}
              className={cn(
                active && "bg-card shadow-sm hover:bg-card",
              )}
            >
              <Icon /> {item.label}
            </Button>
          );
        })}
      </div>

      {view === "board" && (
        <Suspense fallback={<TaskBoardLoading />}>
          <TaskBoard organizationId={organizationId} projectId={projectId} />
        </Suspense>
      )}
      {view === "list" && (
        <Suspense fallback={<TaskTableLoading />}>
          <TaskTable organizationId={organizationId} projectId={projectId} />
        </Suspense>
      )}
      {view === "calendar" && (
        <Suspense fallback={<TaskCalendarLoading />}>
          <TaskCalendar organizationId={organizationId} projectId={projectId} />
        </Suspense>
      )}
    </div>
  );
}

export default function TasksHub({
  organizationId,
  projectId,
}: {
  organizationId: string;
  projectId: string;
}) {
  return (
    <Suspense fallback={<TaskBoardLoading />}>
      <TasksHubContent organizationId={organizationId} projectId={projectId} />
    </Suspense>
  );
}
