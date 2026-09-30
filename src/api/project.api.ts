import apiClient from "@/lib/apiClient";
import type {
  AddProjectMemberPayload,
  ApiResponse,
  CreateProjectPayload,
  ListParams,
  Project,
  ProjectDetail,
  ProjectListParams,
  ProjectMemberItem,
  UpdateProjectPayload,
} from "@/types";

export function createProject(
  organizationId: string,
  payload: CreateProjectPayload,
) {
  return apiClient<ApiResponse<Project>>(
    `/organizations/${organizationId}/projects`,
    {
      method: "POST",
      body: payload,
    },
  );
}

export function getProjects(
  organizationId: string,
  params: ProjectListParams,
) {
  return apiClient<ApiResponse<Project[]>>(
    `/organizations/${organizationId}/projects`,
    {
      params,
    },
  );
}

export function getProject(organizationId: string, projectId: string) {
  return apiClient<ApiResponse<ProjectDetail>>(
    `/organizations/${organizationId}/projects/${projectId}`,
  );
}

export function updateProject(
  organizationId: string,
  projectId: string,
  payload: UpdateProjectPayload,
) {
  return apiClient<ApiResponse<Project>>(
    `/organizations/${organizationId}/projects/${projectId}`,
    {
      method: "PATCH",
      body: payload,
    },
  );
}

export function deleteProject(organizationId: string, projectId: string) {
  return apiClient<ApiResponse<Project>>(
    `/organizations/${organizationId}/projects/${projectId}`,
    {
      method: "DELETE",
    },
  );
}

export function addProjectMember(
  organizationId: string,
  projectId: string,
  payload: AddProjectMemberPayload,
) {
  return apiClient<ApiResponse<ProjectMemberItem>>(
    `/organizations/${organizationId}/projects/${projectId}/members`,
    {
      method: "POST",
      body: payload,
    },
  );
}

export function getProjectMembers(
  organizationId: string,
  projectId: string,
  params: ListParams,
) {
  return apiClient<ApiResponse<ProjectMemberItem[]>>(
    `/organizations/${organizationId}/projects/${projectId}/members`,
    {
      params,
    },
  );
}

export function removeProjectMember(
  organizationId: string,
  projectId: string,
  userId: string,
) {
  return apiClient<ApiResponse<ProjectMemberItem>>(
    `/organizations/${organizationId}/projects/${projectId}/members/${userId}`,
    {
      method: "DELETE",
    },
  );
}
