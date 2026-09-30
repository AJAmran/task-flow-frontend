import apiClient from "@/lib/apiClient";
import type { ApiResponse, OrgSubscriptionDetail } from "@/types";

export function getSubscription(organizationId: string) {
  return apiClient<ApiResponse<OrgSubscriptionDetail>>(
    `/organizations/${organizationId}/subscription`,
  );
}
