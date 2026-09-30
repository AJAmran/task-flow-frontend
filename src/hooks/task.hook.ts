import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  assignTask,
  changeTaskStatus,
  createComment,
  createSubtask,
  createTask,
  deleteAttachment,
  deleteComment,
  deleteSubtask,
  deleteTask,
  getAttachments,
  getComments,
  getMyAssignedTasks,
  getSubtasks,
  getTask,
  getTasks,
  updateSubtask,
  updateTask,
  uploadAttachment,
} from "@/api";
import type {
  ApiResponse,
  AssignTaskPayload,
  ChangeTaskStatusPayload,
  CreateCommentPayload,
  CreateSubtaskPayload,
  CreateTaskPayload,
  ListParams,
  MyAssignedParams,
  Task,
  TaskListParams,
  TaskStatus,
  UpdateSubtaskPayload,
  UpdateTaskPayload,
} from "@/types";

const taskKey = (organizationId: string, projectId: string, taskId?: string) =>
  taskId
    ? ["organizations", organizationId, "projects", projectId, "tasks", taskId]
    : ["organizations", organizationId, "projects", projectId, "tasks"];

export function useCreateTask(organizationId: string, projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTaskPayload) =>
      createTask(organizationId, projectId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: taskKey(organizationId, projectId),
      });
    },
  });
}

export function useTasks(
  organizationId: string,
  projectId: string,
  params: TaskListParams,
) {
  return useQuery({
    queryKey: [...taskKey(organizationId, projectId), params],
    queryFn: () => getTasks(organizationId, projectId, params),
    enabled: !!organizationId && !!projectId,
  });
}

export function useSuspenseTasks(
  organizationId: string,
  projectId: string,
  params: TaskListParams,
) {
  return useSuspenseQuery({
    queryKey: [...taskKey(organizationId, projectId), params],
    queryFn: () => getTasks(organizationId, projectId, params),
  });
}

export function useMyAssignedTasks(
  organizationId: string,
  params: MyAssignedParams,
) {
  return useQuery({
    queryKey: ["organizations", organizationId, "tasks", "my-assigned", params],
    queryFn: () => getMyAssignedTasks(organizationId, params),
    enabled: !!organizationId,
  });
}

export function useTask(
  organizationId: string,
  projectId: string,
  taskId: string,
) {
  return useQuery({
    queryKey: taskKey(organizationId, projectId, taskId),
    queryFn: () => getTask(organizationId, projectId, taskId),
    enabled: !!organizationId && !!projectId && !!taskId,
  });
}

export function useUpdateTask(
  organizationId: string,
  projectId: string,
  taskId: string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateTaskPayload) =>
      updateTask(organizationId, projectId, taskId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: taskKey(organizationId, projectId, taskId),
      });
      queryClient.invalidateQueries({
        queryKey: taskKey(organizationId, projectId),
      });
    },
  });
}

export function useDeleteTask(organizationId: string, projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => deleteTask(organizationId, projectId, taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: taskKey(organizationId, projectId),
      });
    },
  });
}

export function useChangeTaskStatus(
  organizationId: string,
  projectId: string,
  optimistic = false,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: TaskStatus }) =>
      changeTaskStatus(organizationId, projectId, taskId, { status }),
    onMutate: optimistic
      ? async ({ taskId, status }) => {
          await queryClient.cancelQueries({
            queryKey: taskKey(organizationId, projectId),
          });
          const previous = queryClient.getQueriesData({
            queryKey: taskKey(organizationId, projectId),
          });
          queryClient.setQueriesData(
            { queryKey: taskKey(organizationId, projectId) },
            (old: ApiResponse<Task[]> | undefined) => {
              if (!old?.data || !Array.isArray(old.data)) {
                return old;
              }
              return {
                ...old,
                data: old.data.map((t) =>
                  t.id === taskId ? { ...t, status } : t,
                ),
              };
            },
          );
          return { previous };
        }
      : undefined,
    onError: (_err, _vars, context) => {
      const ctx = context as
        | { previous?: Array<[unknown, unknown]> }
        | undefined;
      ctx?.previous?.forEach(([key, data]) => {
        queryClient.setQueryData(key as unknown[], data);
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: taskKey(organizationId, projectId),
      });
    },
  });
}

export function useAssignTask(
  organizationId: string,
  projectId: string,
  taskId: string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AssignTaskPayload) =>
      assignTask(organizationId, projectId, taskId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: taskKey(organizationId, projectId, taskId),
      });
      queryClient.invalidateQueries({
        queryKey: taskKey(organizationId, projectId),
      });
    },
  });
}

export function useCreateSubtask(
  organizationId: string,
  projectId: string,
  taskId: string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSubtaskPayload) =>
      createSubtask(organizationId, projectId, taskId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: taskKey(organizationId, projectId, taskId),
      });
    },
  });
}

export function useSubtasks(
  organizationId: string,
  projectId: string,
  taskId: string,
) {
  return useQuery({
    queryKey: [...taskKey(organizationId, projectId, taskId), "subtasks"],
    queryFn: () => getSubtasks(organizationId, projectId, taskId),
    enabled: !!organizationId && !!projectId && !!taskId,
  });
}

export function useUpdateSubtask(
  organizationId: string,
  projectId: string,
  taskId: string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      subtaskId,
      payload,
    }: {
      subtaskId: string;
      payload: UpdateSubtaskPayload;
    }) => updateSubtask(organizationId, projectId, taskId, subtaskId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: taskKey(organizationId, projectId, taskId),
      });
      queryClient.invalidateQueries({
        queryKey: [...taskKey(organizationId, projectId, taskId), "subtasks"],
      });
    },
  });
}

export function useDeleteSubtask(
  organizationId: string,
  projectId: string,
  taskId: string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (subtaskId: string) =>
      deleteSubtask(organizationId, projectId, taskId, subtaskId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: taskKey(organizationId, projectId, taskId),
      });
      queryClient.invalidateQueries({
        queryKey: [...taskKey(organizationId, projectId, taskId), "subtasks"],
      });
    },
  });
}

export function useCreateComment(
  organizationId: string,
  projectId: string,
  taskId: string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCommentPayload) =>
      createComment(organizationId, projectId, taskId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: taskKey(organizationId, projectId, taskId),
      });
      queryClient.invalidateQueries({
        queryKey: [...taskKey(organizationId, projectId, taskId), "comments"],
      });
    },
  });
}

export function useComments(
  organizationId: string,
  projectId: string,
  taskId: string,
  params: ListParams,
) {
  return useQuery({
    queryKey: [...taskKey(organizationId, projectId, taskId), "comments", params],
    queryFn: () => getComments(organizationId, projectId, taskId, params),
    enabled: !!organizationId && !!projectId && !!taskId,
  });
}

export function useDeleteComment(
  organizationId: string,
  projectId: string,
  taskId: string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) =>
      deleteComment(organizationId, projectId, taskId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: taskKey(organizationId, projectId, taskId),
      });
      queryClient.invalidateQueries({
        queryKey: [...taskKey(organizationId, projectId, taskId), "comments"],
      });
    },
  });
}

export function useUploadAttachment(
  organizationId: string,
  projectId: string,
  taskId: string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) =>
      uploadAttachment(organizationId, projectId, taskId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: taskKey(organizationId, projectId, taskId),
      });
      queryClient.invalidateQueries({
        queryKey: [
          ...taskKey(organizationId, projectId, taskId),
          "attachments",
        ],
      });
    },
  });
}

export function useAttachments(
  organizationId: string,
  projectId: string,
  taskId: string,
) {
  return useQuery({
    queryKey: [
      ...taskKey(organizationId, projectId, taskId),
      "attachments",
    ],
    queryFn: () => getAttachments(organizationId, projectId, taskId),
    enabled: !!organizationId && !!projectId && !!taskId,
  });
}

export function useDeleteAttachment(
  organizationId: string,
  projectId: string,
  taskId: string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (attachmentId: string) =>
      deleteAttachment(organizationId, projectId, taskId, attachmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: taskKey(organizationId, projectId, taskId),
      });
      queryClient.invalidateQueries({
        queryKey: [
          ...taskKey(organizationId, projectId, taskId),
          "attachments",
        ],
      });
    },
  });
}
