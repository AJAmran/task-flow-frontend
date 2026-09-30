import apiClient from "@/lib/apiClient";
import type {
  AcceptInvitationPayload,
  ApiResponse,
  CreateOrganizationPayload,
  CreateOrganizationResponse,
  InviteMemberPayload,
  ListParams,
  MembershipItem,
  Organization,
  OrganizationDetailResponse,
  OrganizationInvitation,
  OrganizationMember,
  UpdateMemberRolePayload,
  UpdateOrganizationPayload,
} from "@/types";

export function acceptInvitation(payload: AcceptInvitationPayload) {
  return apiClient("/organizations/invitations/accept", {
    method: "POST",
    body: payload,
  });
}

export function createOrganization(payload: CreateOrganizationPayload) {
  return apiClient<ApiResponse<CreateOrganizationResponse>>("/organizations", {
    method: "POST",
    body: payload,
  });
}

export function getOrganizations(params: ListParams) {
  return apiClient<ApiResponse<MembershipItem[]>>("/organizations", {
    params,
  });
}

export function getOrganization(organizationId: string) {
  return apiClient<ApiResponse<OrganizationDetailResponse>>(
    `/organizations/${organizationId}`,
  );
}

export function updateOrganization(
  organizationId: string,
  payload: UpdateOrganizationPayload,
) {
  return apiClient<ApiResponse<Organization>>(
    `/organizations/${organizationId}`,
    {
      method: "PATCH",
      body: payload,
    },
  );
}

export function inviteMember(
  organizationId: string,
  payload: InviteMemberPayload,
) {
  return apiClient<ApiResponse<OrganizationInvitation>>(
    `/organizations/${organizationId}/invite`,
    {
      method: "POST",
      body: payload,
    },
  );
}

export function getOrganizationMembers(
  organizationId: string,
  params: ListParams,
) {
  return apiClient<ApiResponse<OrganizationMember[]>>(
    `/organizations/${organizationId}/members`,
    {
      params,
    },
  );
}

export function updateMemberRole(
  organizationId: string,
  userId: string,
  payload: UpdateMemberRolePayload,
) {
  return apiClient<ApiResponse<OrganizationMember>>(
    `/organizations/${organizationId}/members/${userId}`,
    {
      method: "PATCH",
      body: payload,
    },
  );
}

export function removeMember(organizationId: string, userId: string) {
  return apiClient<ApiResponse<OrganizationMember>>(
    `/organizations/${organizationId}/members/${userId}`,
    {
      method: "DELETE",
    },
  );
}
