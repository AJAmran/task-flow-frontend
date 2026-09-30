import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { getOrgDashboard } from "@/api";

export function useOrgDashboard(organizationId: string) {
  return useQuery({
    queryKey: ["organizations", organizationId, "dashboard"],
    queryFn: () => getOrgDashboard(organizationId),
    enabled: !!organizationId,
  });
}

export function useSuspenseOrgDashboard(organizationId: string) {
  return useSuspenseQuery({
    queryKey: ["organizations", organizationId, "dashboard"],
    queryFn: () => getOrgDashboard(organizationId),
  });
}
