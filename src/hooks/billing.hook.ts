import { useQuery } from "@tanstack/react-query";
import { getSubscription } from "@/api";

export function useSubscription(organizationId: string) {
  return useQuery({
    queryKey: ["organizations", organizationId, "subscription"],
    queryFn: () => getSubscription(organizationId),
    enabled: !!organizationId,
  });
}
