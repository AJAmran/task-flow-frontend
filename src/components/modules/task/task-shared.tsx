import { format, isPast } from "date-fns";
import { CalendarDays, MessageSquare, Paperclip } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AvatarInitials from "@/components/ui/avatar-initials";
import type { Task, TaskPriority, TaskStatus } from "@/types";
import { cn } from "@/lib/utils";

export const taskStatuses: TaskStatus[] = [
  "TODO",
  "IN_PROGRESS",
  "IN_REVIEW",
  "DONE",
];

export const statusLabels: Record<TaskStatus, string> = {
  TODO: "Todo",
  IN_PROGRESS: "In Progress",
  IN_REVIEW: "In Review",
  DONE: "Done",
};

const statusStyles: Record<TaskStatus, string> = {
  TODO: "bg-muted text-muted-foreground",
  IN_PROGRESS: "bg-cyan-100 text-cyan-900",
  IN_REVIEW: "bg-amber-100 text-amber-900",
  DONE: "bg-emerald-100 text-emerald-900",
};

const priorityStyles: Record<TaskPriority, string> = {
  LOW: "bg-muted text-muted-foreground",
  MEDIUM: "bg-cyan-100 text-cyan-900",
  HIGH: "bg-amber-100 text-amber-900",
  URGENT: "bg-red-100 text-red-900",
};

export function StatusBadge({ status }: { status: TaskStatus }) {
  return (
    <Badge className={cn("gap-1", statusStyles[status])}>
      {statusLabels[status]}
    </Badge>
  );
}

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return (
    <Badge variant="outline" className={cn(priorityStyles[priority])}>
      {priority[0] + priority.slice(1).toLowerCase()}
    </Badge>
  );
}

export function DueBadge({ dueDate }: { dueDate: string | null }) {
  if (!dueDate) {
    return null;
  }
  const date = new Date(dueDate);
  const overdue = isPast(date);

  return (
    <span
      className={cn(
        "flex items-center gap-1 text-xs",
        overdue ? "font-medium text-red-600" : "text-muted-foreground",
      )}
    >
      <CalendarDays className="size-3" />
      {format(date, "MMM d")}
      {overdue && " · overdue"}
    </span>
  );
}

export function TaskCard({
  organizationId,
  task,
  actions,
}: {
  organizationId: string;
  task: Task;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border bg-card p-3 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <PriorityBadge priority={task.priority} />
        {task.assignee ? (
          <AvatarInitials name={task.assignee.name} size="sm" />
        ) : null}
      </div>
      <Link
        href={`/organizations/${organizationId}/projects/${task.projectId}/tasks/${task.id}`}
        className="text-sm font-medium leading-snug hover:underline"
      >
        {task.title}
      </Link>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <DueBadge dueDate={task.dueDate} />
        {(task._count?.comments ?? 0) > 0 && (
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <MessageSquare className="size-3" />
            {task._count?.comments}
          </span>
        )}
        {task.sprint && (
          <span className="truncate text-xs text-muted-foreground">
            {task.sprint.name}
          </span>
        )}
      </div>
      {actions}
    </div>
  );
}

export function PaperclipCount({ count }: { count: number }) {
  if (count === 0) {
    return null;
  }
  return (
    <span className="flex items-center gap-1 text-xs text-muted-foreground">
      <Paperclip className="size-3" />
      {count}
    </span>
  );
}

export function TaskDetailLink({
  organizationId,
  projectId,
  taskId,
  children,
}: {
  organizationId: string;
  projectId: string;
  taskId: string;
  children: React.ReactNode;
}) {
  return (
    <Button
      variant="link"
      size="sm"
      className="h-auto p-0"
      render={
        <Link
          href={`/organizations/${organizationId}/projects/${projectId}/tasks/${taskId}`}
        >
          {children}
        </Link>
      }
    >
      {children}
    </Button>
  );
}
