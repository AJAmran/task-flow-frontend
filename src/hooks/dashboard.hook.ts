import { useQuery } from "@tanstack/react-query";
import { getOrgDashboard } from "@/api";

export function useOrgDashboard(organizationId: string) {
  return useQuery({
    queryKey: ["organizations", organizationId, "dashboard"],
    queryFn: () => getOrgDashboard(organizationId),
    enabled: !!organizationId,
  });
}
