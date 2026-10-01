import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  addProjectMember,
  createProject,
  deleteProject,
  getProject,
  getProjectMembers,
  getProjects,
  removeProjectMember,
  updateProject,
} from "@/api";
import type {
  AddProjectMemberPayload,
  CreateProjectPayload,
  ListParams,
  ProjectListParams,
  UpdateProjectPayload,
} from "@/types";

const projectKey = (organizationId: string, projectId: string) => [
  "organizations",
  organizationId,
  "projects",
  projectId,
];

export function useCreateProject(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateProjectPayload) =>
      createProject(organizationId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["organizations", organizationId, "projects"],
      });
      queryClient.invalidateQueries({
        queryKey: ["organizations", organizationId],
      });
    },
  });
}

export function useProjects(organizationId: string, params: ProjectListParams) {
  return useQuery({
    queryKey: ["organizations", organizationId, "projects", params],
    queryFn: () => getProjects(organizationId, params),
    enabled: !!organizationId,
  });
}

export function useSuspenseProjects(
  organizationId: string,
  params: ProjectListParams,
) {
  return useSuspenseQuery({
    queryKey: ["organizations", organizationId, "projects", params],
    queryFn: () => getProjects(organizationId, params),
  });
}

export function useProject(organizationId: string, projectId: string) {
  return useQuery({
    queryKey: projectKey(organizationId, projectId),
    queryFn: () => getProject(organizationId, projectId),
    enabled: !!organizationId && !!projectId,
  });
}

export function useUpdateProject(organizationId: string, projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProjectPayload) =>
      updateProject(organizationId, projectId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: projectKey(organizationId, projectId),
      });
      queryClient.invalidateQueries({
        queryKey: ["organizations", organizationId, "projects"],
      });
    },
  });
}

export function useDeleteProject(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) => deleteProject(organizationId, projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["organizations", organizationId, "projects"],
      });
      queryClient.invalidateQueries({
        queryKey: ["organizations", organizationId],
      });
    },
  });
}

export function useAddProjectMember(organizationId: string, projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddProjectMemberPayload) =>
      addProjectMember(organizationId, projectId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: projectKey(organizationId, projectId),
      });
    },
  });
}

export function useProjectMembers(
  organizationId: string,
  projectId: string,
  params: ListParams,
) {
  return useQuery({
    queryKey: [...projectKey(organizationId, projectId), "members", params],
    queryFn: () => getProjectMembers(organizationId, projectId, params),
    enabled: !!organizationId && !!projectId,
  });
}

export function useRemoveProjectMember(
  organizationId: string,
  projectId: string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) =>
      removeProjectMember(organizationId, projectId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: projectKey(organizationId, projectId),
      });
    },
  });
}
