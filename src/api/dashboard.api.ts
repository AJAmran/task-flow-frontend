import apiClient from "@/lib/apiClient";
import type { ApiResponse, OrgDashboard } from "@/types";

export function getOrgDashboard(organizationId: string) {
  return apiClient<ApiResponse<OrgDashboard>>(
    `/organizations/${organizationId}/dashboard`,
  );
}
