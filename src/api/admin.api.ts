import apiClient from "@/lib/apiClient";
import type {
  AdminDashboardStats,
  AdminOrganization,
  AdminOrgListParams,
  AdminOrgStatus,
  AdminUser,
  AdminUserListParams,
  ApiResponse,
  AuditLog,
  AuditLogParams,
} from "@/types";

export function getAdminOrganizations(params: AdminOrgListParams) {
  return apiClient<ApiResponse<AdminOrganization[]>>("/admin/organizations", {
    params,
  });
}

export function updateOrganizationStatus(id: string, status: AdminOrgStatus) {
  return apiClient<ApiResponse<AdminOrganization>>(
    `/admin/organizations/${id}/status`,
    {
      method: "PATCH",
      body: { status },
    },
  );
}

export function getAdminUsers(params: AdminUserListParams) {
  return apiClient<ApiResponse<AdminUser[]>>("/admin/users", {
    params: {
      ...params,
      ...(params.isActive !== undefined && {
        isActive: params.isActive ? "true" : "false",
      }),
    },
  });
}

export function updateUserStatus(id: string, isActive: boolean) {
  return apiClient<ApiResponse<AdminUser>>(`/admin/users/${id}/status`, {
    method: "PATCH",
    body: { isActive },
  });
}

export function getAdminDashboardStats() {
  return apiClient<ApiResponse<AdminDashboardStats>>("/admin/dashboard-stats");
}

export function getAuditLogs(params: AuditLogParams) {
  return apiClient<ApiResponse<AuditLog[]>>("/admin/audit-logs", {
    params,
  });
}
