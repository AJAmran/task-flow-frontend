"use client";

import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  parse,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useTasks } from "@/hooks";
import { cn } from "@/lib/utils";
import TaskCalendarLoading from "./task-calendar-loading";
import { PriorityBadge } from "./task-shared";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function TaskCalendar({
  organizationId,
  projectId,
}: {
  organizationId: string;
  projectId: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const monthParam = searchParams.get("month");
  let month: Date;
  try {
    month =
      monthParam && /^\d{4}-\d{2}$/.test(monthParam)
        ? parse(monthParam, "yyyy-MM", new Date())
        : new Date();
    if (Number.isNaN(month.getTime())) {
      month = new Date();
    }
  } catch {
    month = new Date();
  }

  const setMonth = (next: Date) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("month", format(next, "yyyy-MM"));
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const monthStart = startOfMonth(month);
  const days = eachDayOfInterval({
    start: startOfWeek(monthStart),
    end: endOfWeek(endOfMonth(month)),
  });

  const { data, isPending, isError, refetch } = useTasks(
    organizationId,
    projectId,
    { page: 1, limit: 100, sortBy: "dueDate", sortOrder: "asc" },
  );

  const dated = (data?.data ?? []).filter((t) => t.dueDate);
  const undatedCount = (data?.data ?? []).length - dated.length;

  const byDay = new Map<string, typeof dated>();
  for (const task of dated) {
    const key = format(new Date(task.dueDate as string), "yyyy-MM-dd");
    const list = byDay.get(key) ?? [];
    list.push(task);
    byDay.set(key, list);
  }

  if (isPending) {
    return <TaskCalendarLoading />;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border p-10 text-center">
        <p className="font-medium">Could not load calendar</p>
        <Button variant="outline" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight">
          {format(month, "MMMM yyyy")}
        </h2>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMonth(new Date())}
          >
            Today
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMonth(addMonths(month, -1))}
            aria-label="Previous month"
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMonth(addMonths(month, 1))}
            aria-label="Next month"
          >
            <ChevronRight />
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border bg-card">
        <div className="grid grid-cols-7 border-b bg-muted/50">
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="px-2 py-2 text-center text-xs font-medium text-muted-foreground"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {days.map((day) => {
            const key = format(day, "yyyy-MM-dd");
            const items = byDay.get(key) ?? [];
            const inMonth = isSameMonth(day, month);

            return (
              <div
                key={key}
                className={cn(
                  "min-h-20 border-b p-1.5 align-top [&:nth-last-child(-n+7)]:border-b-0",
                  !inMonth && "bg-muted/30",
                )}
              >
                <span
                  className={cn(
                    "flex size-6 items-center justify-center rounded-full text-xs",
                    isToday(day)
                      ? "bg-teal-600 font-bold text-white"
                      : inMonth
                        ? "font-medium"
                        : "text-muted-foreground",
                  )}
                >
                  {format(day, "d")}
                </span>
                <div className="mt-1 flex flex-col gap-1">
                  {items.slice(0, 2).map((task) => (
                    <Link
                      key={task.id}
                      href={`/organizations/${organizationId}/projects/${projectId}/tasks/${task.id}`}
                      className="truncate rounded bg-teal-600/10 px-1.5 py-0.5 text-[11px] font-medium text-teal-900 hover:bg-teal-600/20"
                      title={task.title}
                    >
                      {task.title}
                    </Link>
                  ))}
                  {items.length > 2 && (
                    <span className="px-1.5 text-[11px] text-muted-foreground">
                      +{items.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold">Upcoming deadlines</h3>
        {dated.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No dated tasks.{" "}
            {undatedCount > 0 &&
              `${undatedCount} task${undatedCount === 1 ? " has" : "s have"} no due date.`}
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {dated.slice(0, 8).map((task) => (
              <li
                key={task.id}
                className="flex items-center justify-between gap-2 rounded-lg border px-3 py-2"
              >
                <Link
                  href={`/organizations/${organizationId}/projects/${projectId}/tasks/${task.id}`}
                  className="min-w-0 flex-1 truncate text-sm font-medium hover:underline"
                >
                  {task.title}
                </Link>
                <span className="flex shrink-0 items-center gap-2">
                  <PriorityBadge priority={task.priority} />
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(task.dueDate as string), "MMM d, yyyy")}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export function TaskCalendarSkeleton() {
  return (
    <div className="flex flex-col gap-4" aria-hidden>
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-96 w-full" />
    </div>
  );
}
