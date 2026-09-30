import apiClient from "@/lib/apiClient";
import type {
  AddTeamMemberPayload,
  ApiResponse,
  CreateTeamPayload,
  ListParams,
  Team,
  TeamMember,
  UpdateTeamPayload,
} from "@/types";

export function createTeam(organizationId: string, payload: CreateTeamPayload) {
  return apiClient<ApiResponse<Team>>(
    `/organizations/${organizationId}/teams`,
    {
      method: "POST",
      body: payload,
    },
  );
}

export function getTeams(organizationId: string, params: ListParams) {
  return apiClient<ApiResponse<Team[]>>(
    `/organizations/${organizationId}/teams`,
    {
      params,
    },
  );
}

export function getTeam(organizationId: string, teamId: string) {
  return apiClient<ApiResponse<Team>>(
    `/organizations/${organizationId}/teams/${teamId}`,
  );
}

export function updateTeam(
  organizationId: string,
  teamId: string,
  payload: UpdateTeamPayload,
) {
  return apiClient<ApiResponse<Team>>(
    `/organizations/${organizationId}/teams/${teamId}`,
    {
      method: "PATCH",
      body: payload,
    },
  );
}

export function deleteTeam(organizationId: string, teamId: string) {
  return apiClient<ApiResponse<Team>>(
    `/organizations/${organizationId}/teams/${teamId}`,
    {
      method: "DELETE",
    },
  );
}

export function addTeamMember(
  organizationId: string,
  teamId: string,
  payload: AddTeamMemberPayload,
) {
  return apiClient<ApiResponse<TeamMember>>(
    `/organizations/${organizationId}/teams/${teamId}/members`,
    {
      method: "POST",
      body: payload,
    },
  );
}

export function getTeamMembers(
  organizationId: string,
  teamId: string,
  params: ListParams,
) {
  return apiClient<ApiResponse<TeamMember[]>>(
    `/organizations/${organizationId}/teams/${teamId}/members`,
    {
      params,
    },
  );
}

export function removeTeamMember(
  organizationId: string,
  teamId: string,
  userId: string,
) {
  return apiClient<ApiResponse<TeamMember>>(
    `/organizations/${organizationId}/teams/${teamId}/members/${userId}`,
    {
      method: "DELETE",
    },
  );
}
