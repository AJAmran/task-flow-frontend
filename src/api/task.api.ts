import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  AssignTaskPayload,
  AssignedTask,
  ChangeTaskStatusPayload,
  CreateCommentPayload,
  CreateSubtaskPayload,
  CreateTaskPayload,
  ListParams,
  MyAssignedParams,
  Task,
  TaskAttachment,
  TaskComment,
  TaskDetail,
  TaskListParams,
  UpdateSubtaskPayload,
  UpdateTaskPayload,
} from "@/types";

const base = (organizationId: string, projectId: string) =>
  `/organizations/${organizationId}/projects/${projectId}/tasks`;

const item = (organizationId: string, projectId: string, taskId: string) =>
  `${base(organizationId, projectId)}/${taskId}`;

export function createTask(
  organizationId: string,
  projectId: string,
  payload: CreateTaskPayload,
) {
  return apiClient<ApiResponse<Task>>(base(organizationId, projectId), {
    method: "POST",
    body: payload,
  });
}

export function getTasks(
  organizationId: string,
  projectId: string,
  params: TaskListParams,
) {
  return apiClient<ApiResponse<Task[]>>(base(organizationId, projectId), {
    params,
  });
}

export function getMyAssignedTasks(
  organizationId: string,
  params: MyAssignedParams,
) {
  return apiClient<ApiResponse<AssignedTask[]>>(
    `/organizations/${organizationId}/tasks/my-assigned`,
    {
      params,
    },
  );
}

export function getTask(
  organizationId: string,
  projectId: string,
  taskId: string,
) {
  return apiClient<ApiResponse<TaskDetail>>(item(organizationId, projectId, taskId));
}

export function updateTask(
  organizationId: string,
  projectId: string,
  taskId: string,
  payload: UpdateTaskPayload,
) {
  return apiClient<ApiResponse<Task>>(item(organizationId, projectId, taskId), {
    method: "PATCH",
    body: payload,
  });
}

export function deleteTask(
  organizationId: string,
  projectId: string,
  taskId: string,
) {
  return apiClient<ApiResponse<Task>>(item(organizationId, projectId, taskId), {
    method: "DELETE",
  });
}

export function changeTaskStatus(
  organizationId: string,
  projectId: string,
  taskId: string,
  payload: ChangeTaskStatusPayload,
) {
  return apiClient<ApiResponse<Task>>(
    `${item(organizationId, projectId, taskId)}/status`,
    {
      method: "PATCH",
      body: payload,
    },
  );
}

export function assignTask(
  organizationId: string,
  projectId: string,
  taskId: string,
  payload: AssignTaskPayload,
) {
  return apiClient<ApiResponse<Task>>(
    `${item(organizationId, projectId, taskId)}/assign`,
    {
      method: "POST",
      body: payload,
    },
  );
}

export function createSubtask(
  organizationId: string,
  projectId: string,
  taskId: string,
  payload: CreateSubtaskPayload,
) {
  return apiClient<ApiResponse<TaskDetail["subtasks"][number]>>(
    `${item(organizationId, projectId, taskId)}/subtasks`,
    {
      method: "POST",
      body: payload,
    },
  );
}

export function getSubtasks(
  organizationId: string,
  projectId: string,
  taskId: string,
) {
  return apiClient<ApiResponse<TaskDetail["subtasks"]>>(
    `${item(organizationId, projectId, taskId)}/subtasks`,
  );
}

export function updateSubtask(
  organizationId: string,
  projectId: string,
  taskId: string,
  subtaskId: string,
  payload: UpdateSubtaskPayload,
) {
  return apiClient<ApiResponse<TaskDetail["subtasks"][number]>>(
    `${item(organizationId, projectId, taskId)}/subtasks/${subtaskId}`,
    {
      method: "PATCH",
      body: payload,
    },
  );
}

export function deleteSubtask(
  organizationId: string,
  projectId: string,
  taskId: string,
  subtaskId: string,
) {
  return apiClient<ApiResponse<unknown>>(
    `${item(organizationId, projectId, taskId)}/subtasks/${subtaskId}`,
    {
      method: "DELETE",
    },
  );
}

export function createComment(
  organizationId: string,
  projectId: string,
  taskId: string,
  payload: CreateCommentPayload,
) {
  return apiClient<ApiResponse<TaskComment>>(
    `${item(organizationId, projectId, taskId)}/comments`,
    {
      method: "POST",
      body: payload,
    },
  );
}

export function getComments(
  organizationId: string,
  projectId: string,
  taskId: string,
  params: ListParams,
) {
  return apiClient<ApiResponse<TaskComment[]>>(
    `${item(organizationId, projectId, taskId)}/comments`,
    {
      params,
    },
  );
}

export function deleteComment(
  organizationId: string,
  projectId: string,
  taskId: string,
  commentId: string,
) {
  return apiClient<ApiResponse<unknown>>(
    `${item(organizationId, projectId, taskId)}/comments/${commentId}`,
    {
      method: "DELETE",
    },
  );
}

export function uploadAttachment(
  organizationId: string,
  projectId: string,
  taskId: string,
  formData: FormData,
) {
  return apiClient<ApiResponse<TaskAttachment>>(
    `${item(organizationId, projectId, taskId)}/attachments`,
    {
      method: "POST",
      body: formData,
    },
  );
}

export function getAttachments(
  organizationId: string,
  projectId: string,
  taskId: string,
) {
  return apiClient<ApiResponse<TaskAttachment[]>>(
    `${item(organizationId, projectId, taskId)}/attachments`,
  );
}

export function deleteAttachment(
  organizationId: string,
  projectId: string,
  taskId: string,
  attachmentId: string,
) {
  return apiClient<ApiResponse<unknown>>(
    `${item(organizationId, projectId, taskId)}/attachments/${attachmentId}`,
    {
      method: "DELETE",
    },
  );
}
