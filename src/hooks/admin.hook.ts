import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAdminDashboardStats,
  getAdminOrganizations,
  getAdminUsers,
  getAuditLogs,
  updateOrganizationStatus,
  updateUserStatus,
} from "@/api";
import type {
  AdminOrgListParams,
  AdminOrgStatus,
  AdminUserListParams,
  AuditLogParams,
} from "@/types";

export function useAdminDashboardStats() {
  return useQuery({
    queryKey: ["admin", "dashboard-stats"],
    queryFn: getAdminDashboardStats,
  });
}

export function useAdminOrganizations(params: AdminOrgListParams) {
  return useQuery({
    queryKey: ["admin", "organizations", params],
    queryFn: () => getAdminOrganizations(params),
  });
}

export function useUpdateOrganizationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: AdminOrgStatus }) =>
      updateOrganizationStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "organizations"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "audit-logs"] });
    },
  });
}

export function useAdminUsers(params: AdminUserListParams) {
  return useQuery({
    queryKey: ["admin", "users", params],
    queryFn: () => getAdminUsers(params),
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      updateUserStatus(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "audit-logs"] });
    },
  });
}

export function useAuditLogs(params: AuditLogParams) {
  return useQuery({
    queryKey: ["admin", "audit-logs", params],
    queryFn: () => getAuditLogs(params),
  });
}
