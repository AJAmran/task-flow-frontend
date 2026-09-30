import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  CreateSprintPayload,
  Sprint,
  SprintListParams,
  UpdateSprintPayload,
} from "@/types";

const base = (organizationId: string, projectId: string) =>
  `/organizations/${organizationId}/projects/${projectId}/sprints`;

export function createSprint(
  organizationId: string,
  projectId: string,
  payload: CreateSprintPayload,
) {
  return apiClient<ApiResponse<Sprint>>(base(organizationId, projectId), {
    method: "POST",
    body: payload,
  });
}

export function getSprints(
  organizationId: string,
  projectId: string,
  params: SprintListParams,
) {
  return apiClient<ApiResponse<Sprint[]>>(base(organizationId, projectId), {
    params,
  });
}

export function getSprint(
  organizationId: string,
  projectId: string,
  sprintId: string,
) {
  return apiClient<ApiResponse<Sprint>>(
    `${base(organizationId, projectId)}/${sprintId}`,
  );
}

export function updateSprint(
  organizationId: string,
  projectId: string,
  sprintId: string,
  payload: UpdateSprintPayload,
) {
  return apiClient<ApiResponse<Sprint>>(
    `${base(organizationId, projectId)}/${sprintId}`,
    {
      method: "PATCH",
      body: payload,
    },
  );
}

export function activateSprint(
  organizationId: string,
  projectId: string,
  sprintId: string,
) {
  return apiClient<ApiResponse<Sprint>>(
    `${base(organizationId, projectId)}/${sprintId}/activate`,
    {
      method: "POST",
    },
  );
}

export function completeSprint(
  organizationId: string,
  projectId: string,
  sprintId: string,
) {
  return apiClient<ApiResponse<Sprint>>(
    `${base(organizationId, projectId)}/${sprintId}/complete`,
    {
      method: "POST",
    },
  );
}
