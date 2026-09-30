"use client";

import { formatDistanceToNow } from "date-fns";
import {
  CalendarDays,
  CheckCircle2,
  Circle,
  FileText,
  Image as ImageIcon,
  MessageSquare,
  Paperclip,
  Plus,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import AvatarInitials from "@/components/ui/avatar-initials";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import {
  useAssignTask,
  useAttachments,
  useChangeTaskStatus,
  useComments,
  useCreateComment,
  useCreateSubtask,
  useDeleteAttachment,
  useDeleteComment,
  useDeleteSubtask,
  useDeleteTask,
  useProject,
  useSubtasks,
  useTask,
  useUpdateSubtask,
  useUpdateTask,
  useUploadAttachment,
} from "@/hooks";
import { formatFileSize } from "@/utils";
import type { TaskPriority, TaskStatus } from "@/types";
import { PriorityBadge, StatusBadge, statusLabels, taskStatuses } from "./task-shared";
import TaskDetailLoading from "./task-detail-loading";
import Image from "next/image";

const priorities: TaskPriority[] = ["LOW", "MEDIUM", "HIGH", "URGENT"];

function SubtaskSection({
  organizationId,
  projectId,
  taskId,
}: {
  organizationId: string;
  projectId: string;
  taskId: string;
}) {
  const [title, setTitle] = useState("");
  const { data, isPending } = useSubtasks(organizationId, projectId, taskId);
  const { mutate: create, isPending: creating } = useCreateSubtask(
    organizationId,
    projectId,
    taskId,
  );
  const { mutate: update } = useUpdateSubtask(
    organizationId,
    projectId,
    taskId,
  );
  const { mutate: remove } = useDeleteSubtask(
    organizationId,
    projectId,
    taskId,
  );

  const subtasks = data?.data ?? [];
  const done = subtasks.filter((s) => s.isDone).length;

  const handleAdd = () => {
    const trimmed = title.trim();
    if (!trimmed) {
      return;
    }
    create(
      { title: trimmed },
      {
        onSuccess: () => setTitle(""),
        onError: (err) =>
          toast.add({
            title: "Add failed",
            description: err.message || "Please try again",
            type: "error",
          }),
      },
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          Subtasks {subtasks.length > 0 && `(${done}/${subtasks.length})`}
        </CardTitle>
        <CardDescription>Break the work into checkable steps.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {subtasks.length > 0 && (
          <div
            className="h-1.5 overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-valuenow={done}
            aria-valuemin={0}
            aria-valuemax={subtasks.length}
          >
            <div
              className="h-full bg-teal-500 transition-all"
              style={{
                width: `${(done / subtasks.length) * 100}%`,
              }}
            />
          </div>
        )}
        {isPending ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Spinner /> Loading subtasks...
          </div>
        ) : (
          subtasks.map((subtask) => (
            <div
              key={subtask.id}
              className="flex items-center gap-2 rounded-lg border px-3 py-2"
            >
              <button
                type="button"
                onClick={() =>
                  update({
                    subtaskId: subtask.id,
                    payload: { isDone: !subtask.isDone },
                  })
                }
                aria-label={subtask.isDone ? "Mark as not done" : "Mark as done"}
                className="shrink-0"
              >
                {subtask.isDone ? (
                  <CheckCircle2 className="size-5 text-teal-600" />
                ) : (
                  <Circle className="size-5 text-muted-foreground" />
                )}
              </button>
              <span
                className={
                  subtask.isDone
                    ? "min-w-0 flex-1 truncate text-sm text-muted-foreground line-through"
                    : "min-w-0 flex-1 truncate text-sm"
                }
              >
                {subtask.title}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => remove(subtask.id)}
                aria-label={`Delete subtask ${subtask.title}`}
              >
                <Trash2 />
              </Button>
            </div>
          ))
        )}
        <div className="flex gap-2 pt-1">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAdd();
              }
            }}
            placeholder="Add a subtask and press Enter"
            aria-label="New subtask title"
            maxLength={200}
          />
          <Button
            size="sm"
            disabled={!title.trim() || creating}
            onClick={handleAdd}
          >
            {creating ? <Spinner /> : <Plus />}
            Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function CommentSection({
  organizationId,
  projectId,
  taskId,
}: {
  organizationId: string;
  projectId: string;
  taskId: string;
}) {
  const [content, setContent] = useState("");
  const { data, isPending } = useComments(organizationId, projectId, taskId, {
    page: 1,
    limit: 50,
  });
  const { mutate: create, isPending: creating } = useCreateComment(
    organizationId,
    projectId,
    taskId,
  );
  const { mutate: remove } = useDeleteComment(
    organizationId,
    projectId,
    taskId,
  );

  const comments = data?.data ?? [];

  const handleAdd = () => {
    const trimmed = content.trim();
    if (!trimmed) {
      return;
    }
    create(
      { content: trimmed },
      {
        onSuccess: () => setContent(""),
        onError: (err) =>
          toast.add({
            title: "Comment failed",
            description: err.message || "Please try again",
            type: "error",
          }),
      },
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <MessageSquare className="size-4" /> Comments ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {isPending ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Spinner /> Loading comments...
          </div>
        ) : comments.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No comments yet. Discuss blockers, decisions, and updates here.
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="flex gap-2 rounded-lg border bg-muted/20 p-3"
            >
              <AvatarInitials name={comment.user.name} size="sm" />
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-medium">
                    {comment.user.name}
                  </span>
                  <span className="flex shrink-0 items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6"
                      onClick={() => remove(comment.id)}
                      aria-label="Delete comment"
                    >
                      <Trash2 className="size-3" />
                    </Button>
                  </span>
                </div>
                <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
              </div>
            </div>
          ))
        )}
        <div className="flex flex-col gap-2 pt-1">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write a comment..."
            aria-label="New comment"
            rows={3}
            maxLength={2000}
          />
          <Button
            size="sm"
            className="w-fit"
            disabled={!content.trim() || creating}
            onClick={handleAdd}
          >
            {creating ? (
              <>
                <Spinner /> Posting...
              </>
            ) : (
              "Post comment"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function AttachmentSection({
  organizationId,
  projectId,
  taskId,
}: {
  organizationId: string;
  projectId: string;
  taskId: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const { data, isPending } = useAttachments(
    organizationId,
    projectId,
    taskId,
  );
  const { mutate: upload, isPending: uploading } = useUploadAttachment(
    organizationId,
    projectId,
    taskId,
  );
  const { mutate: remove } = useDeleteAttachment(
    organizationId,
    projectId,
    taskId,
  );

  const attachments = data?.data ?? [];

  const handleFile = (file: File | undefined) => {
    if (!file) {
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.add({
        title: "File too large",
        description: `“${file.name}” is ${formatFileSize(file.size)}. Maximum is 5 MB.`,
        type: "error",
      });
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    upload(formData, {
      onSuccess: () => {
        toast.add({
          title: "File uploaded",
          description: `“${file.name}” is attached to this task.`,
          type: "success",
        });
        if (fileRef.current) {
          fileRef.current.value = "";
        }
      },
      onError: (err) => {
        toast.add({
          title: "Upload failed",
          description:
            err.message || "Allowed: images, pdf, txt, md, zip (max 5MB).",
          type: "error",
        });
      },
    });
  };

  const isImage = (fileName: string) =>
    /\.(jpe?g|png|webp|gif)$/i.test(fileName);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Paperclip className="size-4" /> Attachments ({attachments.length})
        </CardTitle>
        <CardDescription>
          Images, PDF, text, markdown, or zip — max 5 MB each.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {isPending ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Spinner /> Loading attachments...
          </div>
        ) : attachments.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No files yet. Attach designs, specs, or references.
          </p>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2">
            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="flex items-center gap-2 rounded-lg border p-2"
              >
                {isImage(attachment.fileName) ? (
                  <Image
                    src={attachment.url}
                    alt={attachment.fileName}
                    width={48}
                    height={48}
                    className="size-12 shrink-0 rounded-md object-cover"
                  />
                ) : (
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-md bg-muted">
                    <FileText className="size-5 text-muted-foreground" />
                  </span>
                )}
                <span className="min-w-0 flex-1">
                  <a
                    href={attachment.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block truncate text-sm font-medium hover:underline"
                  >
                    {attachment.fileName}
                  </a>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    {isImage(attachment.fileName) ? (
                      <ImageIcon className="size-3" />
                    ) : (
                      <FileText className="size-3" />
                    )}
                    Open file
                  </span>
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(attachment.id)}
                  aria-label={`Delete ${attachment.fileName}`}
                >
                  <Trash2 />
                </Button>
              </div>
            ))}
          </div>
        )}
        <div className="flex items-center gap-2 pt-1">
          <Input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,application/pdf,.txt,.md,.zip"
            onChange={(e) => handleFile(e.target.files?.[0])}
            aria-label="Choose a file to attach"
            className="max-w-xs"
          />
          {uploading && (
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <Spinner /> Uploading...
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function TaskDetail({
  organizationId,
  projectId,
  taskId,
}: {
  organizationId: string;
  projectId: string;
  taskId: string;
}) {
  const router = useRouter();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { data, isPending, isError, refetch } = useTask(
    organizationId,
    projectId,
    taskId,
  );
  const { data: projectData } = useProject(organizationId, projectId);
  const { mutate: updateTask, isPending: updating } = useUpdateTask(
    organizationId,
    projectId,
    taskId,
  );
  const { mutate: moveTask, isPending: moving } = useChangeTaskStatus(
    organizationId,
    projectId,
  );
  const { mutate: assignTask, isPending: assigning } = useAssignTask(
    organizationId,
    projectId,
    taskId,
  );
  const { mutate: removeTask, isPending: deleting } = useDeleteTask(
    organizationId,
    projectId,
  );

  const task = data?.data;
  const members = projectData?.data?.members ?? [];
  const busy = updating || moving || assigning;

  if (isPending) {
    return <TaskDetailLoading />;
  }

  if (isError || !task) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border p-10 text-center">
        <p className="font-medium">Could not load task</p>
        <p className="text-sm text-muted-foreground">
          It may have been deleted.
        </p>
        <Button variant="outline" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  const patchPriority = (priority: TaskPriority) =>
    updateTask(
      { priority },
      {
        onSuccess: () =>
          toast.add({
            title: "Priority updated",
            type: "success",
            description: "",
          }),
        onError: (err) =>
          toast.add({
            title: "Update failed",
            description: err.message || "Please try again",
            type: "error",
          }),
      },
    );

  const patchStatus = (status: TaskStatus) =>
    moveTask(
      { taskId: task.id, status },
      {
        onSuccess: () =>
          toast.add({
            title: "Status updated",
            type: "success",
            description: `Moved to ${statusLabels[status]}.`,
          }),
        onError: (err) =>
          toast.add({
            title: "Update failed",
            description: err.message || "Please try again",
            type: "error",
          }),
      },
    );

  const patchAssignee = (userId: string) =>
    assignTask(
      { userId },
      {
        onSuccess: () =>
          toast.add({
            title: "Assignee updated",
            type: "success",
            description: "",
          }),
        onError: (err) =>
          toast.add({
            title: "Assign failed",
            description: err.message || "Please try again",
            type: "error",
          }),
      },
    );

  const handleDelete = () => {
    removeTask(task.id, {
      onSuccess: () => {
        toast.add({
          title: "Task deleted",
          description: `“${task.title}” was removed.`,
          type: "success",
        });
        router.push(
          `/organizations/${organizationId}/projects/${projectId}/board`,
        );
      },
      onError: (err) =>
        toast.add({
          title: "Delete failed",
          description: err.message || "Please try again",
          type: "error",
        }),
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        <h2 className="text-xl font-bold tracking-tight">{task.title}</h2>
        {task.description && (
          <p className="text-sm whitespace-pre-wrap text-muted-foreground">
            {task.description}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={task.status}
            disabled={busy}
            onValueChange={(val: string | null) => {
              const next = val as TaskStatus | null;
              if (next && next !== task.status) {
                patchStatus(next);
              }
            }}
          >
            <SelectTrigger className="w-40" aria-label="Change status">
              <StatusBadge status={task.status} />
            </SelectTrigger>
            <SelectContent>
              {taskStatuses.map((s) => (
                <SelectItem key={s} value={s}>
                  {statusLabels[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={task.priority}
            disabled={busy}
            onValueChange={(val: string | null) => {
              const next = val as TaskPriority | null;
              if (next && next !== task.priority) {
                patchPriority(next);
              }
            }}
          >
            <SelectTrigger className="w-36" aria-label="Change priority">
              <PriorityBadge priority={task.priority} />
            </SelectTrigger>
            <SelectContent>
              {priorities.map((p) => (
                <SelectItem key={p} value={p}>
                  {p[0] + p.slice(1).toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {task.assignee ? (
            <Badge variant="secondary" className="gap-1.5">
              <AvatarInitials name={task.assignee.name} size="sm" />
              {task.assignee.name}
            </Badge>
          ) : (
            <Badge variant="outline">Unassigned</Badge>
          )}
          {task.sprint && (
            <Badge variant="outline">{task.sprint.name}</Badge>
          )}
          {task.dueDate && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <CalendarDays className="size-3" />
              Due {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          {members.length > 0 && (
            <Select
              value={task.assigneeId ?? "__none__"}
              disabled={busy}
              onValueChange={(val: string | null) => {
                if (!val || val === (task.assigneeId ?? "__none__")) {
                  return;
                }
                patchAssignee(val);
              }}
            >
              <SelectTrigger className="w-48" aria-label="Change assignee">
                <SelectValue placeholder="Assign..." />
              </SelectTrigger>
              <SelectContent>
                {members.map((member) => (
                  <SelectItem key={member.userId} value={member.userId}>
                    {member.user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {confirmDelete ? (
            <>
              <Button
                variant="destructive"
                size="sm"
                disabled={deleting}
                onClick={handleDelete}
              >
                {deleting ? <Spinner /> : "Confirm delete"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setConfirmDelete(false)}
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setConfirmDelete(true)}
            >
              <Trash2 /> Delete
            </Button>
          )}
        </div>
      </div>

      <SubtaskSection
        organizationId={organizationId}
        projectId={projectId}
        taskId={task.id}
      />
      <CommentSection
        organizationId={organizationId}
        projectId={projectId}
        taskId={task.id}
      />
      <AttachmentSection
        organizationId={organizationId}
        projectId={projectId}
        taskId={task.id}
      />
    </div>
  );
}

export function TaskDetailSkeleton() {
  return (
    <div className="flex flex-col gap-4" aria-hidden>
      <Skeleton className="h-7 w-64" />
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-40 w-full" />
    </div>
  );
}
