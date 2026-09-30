import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  acceptInvitation,
  createOrganization,
  getOrganization,
  getOrganizationMembers,
  getOrganizations,
  inviteMember,
  removeMember,
  updateMemberRole,
  updateOrganization,
} from "@/api";
import type {
  CreateOrganizationPayload,
  InviteMemberPayload,
  ListParams,
  UpdateMemberRolePayload,
  UpdateOrganizationPayload,
} from "@/types";

export function useAcceptInvitation() {
  return useMutation({
    mutationFn: acceptInvitation,
  });
}

export function useCreateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateOrganizationPayload) =>
      createOrganization(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}

export function useOrganizations(params: ListParams) {
  return useQuery({
    queryKey: ["organizations", params],
    queryFn: () => getOrganizations(params),
  });
}

export function useSuspenseOrganizations(params: ListParams) {
  return useSuspenseQuery({
    queryKey: ["organizations", params],
    queryFn: () => getOrganizations(params),
  });
}

export function useOrganization(organizationId: string) {
  return useQuery({
    queryKey: ["organizations", organizationId],
    queryFn: () => getOrganization(organizationId),
    enabled: !!organizationId,
  });
}

export function useUpdateOrganization(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateOrganizationPayload) =>
      updateOrganization(organizationId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["organizations", organizationId],
      });
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
  });
}

export function useInviteMember(organizationId: string) {
  return useMutation({
    mutationFn: (payload: InviteMemberPayload) =>
      inviteMember(organizationId, payload),
  });
}

export function useOrganizationMembers(
  organizationId: string,
  params: ListParams,
) {
  return useQuery({
    queryKey: ["organizations", organizationId, "members", params],
    queryFn: () => getOrganizationMembers(organizationId, params),
    enabled: !!organizationId,
  });
}

export function useSuspenseOrganizationMembers(
  organizationId: string,
  params: ListParams,
) {
  return useSuspenseQuery({
    queryKey: ["organizations", organizationId, "members", params],
    queryFn: () => getOrganizationMembers(organizationId, params),
  });
}

export function useUpdateMemberRole(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      payload,
    }: {
      userId: string;
      payload: UpdateMemberRolePayload;
    }) => updateMemberRole(organizationId, userId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["organizations", organizationId, "members"],
      });
    },
  });
}

export function useRemoveMember(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => removeMember(organizationId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["organizations", organizationId, "members"],
      });
      queryClient.invalidateQueries({
        queryKey: ["organizations", organizationId],
      });
    },
  });
}
