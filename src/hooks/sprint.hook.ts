import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  activateSprint,
  completeSprint,
  createSprint,
  getSprint,
  getSprints,
  updateSprint,
} from "@/api";
import type {
  CreateSprintPayload,
  SprintListParams,
  UpdateSprintPayload,
} from "@/types";

const sprintKey = (
  organizationId: string,
  projectId: string,
  sprintId?: string,
) =>
  sprintId
    ? ["organizations", organizationId, "projects", projectId, "sprints", sprintId]
    : ["organizations", organizationId, "projects", projectId, "sprints"];

export function useCreateSprint(organizationId: string, projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSprintPayload) =>
      createSprint(organizationId, projectId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: sprintKey(organizationId, projectId),
      });
    },
  });
}

export function useSprints(
  organizationId: string,
  projectId: string,
  params: SprintListParams,
) {
  return useQuery({
    queryKey: [...sprintKey(organizationId, projectId), params],
    queryFn: () => getSprints(organizationId, projectId, params),
    enabled: !!organizationId && !!projectId,
  });
}

export function useSuspenseSprints(
  organizationId: string,
  projectId: string,
  params: SprintListParams,
) {
  return useSuspenseQuery({
    queryKey: [...sprintKey(organizationId, projectId), params],
    queryFn: () => getSprints(organizationId, projectId, params),
  });
}

export function useSprint(
  organizationId: string,
  projectId: string,
  sprintId: string,
) {
  return useQuery({
    queryKey: sprintKey(organizationId, projectId, sprintId),
    queryFn: () => getSprint(organizationId, projectId, sprintId),
    enabled: !!organizationId && !!projectId && !!sprintId,
  });
}

export function useUpdateSprint(
  organizationId: string,
  projectId: string,
  sprintId: string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateSprintPayload) =>
      updateSprint(organizationId, projectId, sprintId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: sprintKey(organizationId, projectId),
      });
    },
  });
}

export function useActivateSprint(organizationId: string, projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sprintId: string) =>
      activateSprint(organizationId, projectId, sprintId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: sprintKey(organizationId, projectId),
      });
    },
  });
}

export function useCompleteSprint(organizationId: string, projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sprintId: string) =>
      completeSprint(organizationId, projectId, sprintId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: sprintKey(organizationId, projectId),
      });
    },
  });
}
