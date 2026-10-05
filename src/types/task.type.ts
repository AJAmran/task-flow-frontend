import type { ListParams } from "./organization.type";
import type { User } from "./user.type";

export type TaskStatus = "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type TaskSortBy = "createdAt" | "updatedAt" | "dueDate" | "priority";

export interface CreateTaskPayload {
  title: string;
  description?: string;
  priority?: TaskPriority;
  sprintId?: string;
  assigneeId?: string;
  dueDate?: string;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string | null;
  priority?: TaskPriority;
  sprintId?: string | null;
  dueDate?: string | null;
}

export interface ChangeTaskStatusPayload {
  status: TaskStatus;
}

export interface AssignTaskPayload {
  userId: string | null;
}

export interface CreateSubtaskPayload {
  title: string;
}

export interface UpdateSubtaskPayload {
  title?: string;
  isDone?: boolean;
}

export interface CreateCommentPayload {
  content: string;
}

export interface TaskListParams extends ListParams {
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string;
  sprintId?: string;
  sortBy?: TaskSortBy;
  sortOrder?: "asc" | "desc";
  q?: string;
}

export interface MyAssignedParams extends ListParams {
  status?: TaskStatus;
}

export interface TaskAssignee {
  id: string;
  name: string;
  email: string;
  profileImage: string | null;
}

export interface TaskSprintRef {
  id: string;
  name: string;
  status: string;
}

export interface TaskCounts {
  subtasks: number;
  comments: number;
}

export interface Task {
  id: string;
  projectId: string;
  sprintId: string | null;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: string | null;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  assignee?: TaskAssignee | null;
  sprint?: TaskSprintRef | null;
  _count?: TaskCounts;
}

export interface AssignedTask extends Task {
  project: {
    id: string;
    name: string;
  };
}

export interface Subtask {
  id: string;
  taskId: string;
  title: string;
  isDone: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TaskComment {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: Pick<User, "id" | "name" | "profileImage">;
}

export interface TaskAttachment {
  id: string;
  taskId: string;
  url: string;
  publicId: string | null;
  fileName: string;
  uploadedBy: string;
  createdAt: string;
}

export interface TaskDetail extends Task {
  subtasks: Subtask[];
  comments: TaskComment[];
  attachments: TaskAttachment[];
}
