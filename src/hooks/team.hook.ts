import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  addTeamMember,
  createTeam,
  deleteTeam,
  getTeamMembers,
  getTeams,
  removeTeamMember,
  updateTeam,
} from "@/api";
import type {
  AddTeamMemberPayload,
  CreateTeamPayload,
  ListParams,
  UpdateTeamPayload,
} from "@/types";

export function useCreateTeam(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTeamPayload) =>
      createTeam(organizationId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["organizations", organizationId, "teams"],
      });
    },
  });
}

export function useTeams(organizationId: string, params: ListParams) {
  return useQuery({
    queryKey: ["organizations", organizationId, "teams", params],
    queryFn: () => getTeams(organizationId, params),
    enabled: !!organizationId,
  });
}

export function useUpdateTeam(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      teamId,
      payload,
    }: {
      teamId: string;
      payload: UpdateTeamPayload;
    }) => updateTeam(organizationId, teamId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["organizations", organizationId, "teams"],
      });
    },
  });
}

export function useDeleteTeam(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (teamId: string) => deleteTeam(organizationId, teamId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["organizations", organizationId, "teams"],
      });
      queryClient.invalidateQueries({
        queryKey: ["organizations", organizationId],
      });
    },
  });
}

export function useAddTeamMember(organizationId: string, teamId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddTeamMemberPayload) =>
      addTeamMember(organizationId, teamId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["organizations", organizationId, "teams", teamId, "members"],
      });
    },
  });
}

export function useTeamMembers(
  organizationId: string,
  teamId: string,
  params: ListParams,
) {
  return useQuery({
    queryKey: [
      "organizations",
      organizationId,
      "teams",
      teamId,
      "members",
      params,
    ],
    queryFn: () => getTeamMembers(organizationId, teamId, params),
    enabled: !!organizationId && !!teamId,
  });
}

export function useRemoveTeamMember(organizationId: string, teamId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) =>
      removeTeamMember(organizationId, teamId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["organizations", organizationId, "teams", teamId, "members"],
      });
    },
  });
}