import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  executePayment,
  getPaymentById,
  initiatePayment,
} from "@/api";
import type { InitiatePaymentPayload } from "@/types";

export function useInitiatePayment() {
  return useMutation({
    mutationFn: (payload: InitiatePaymentPayload) => initiatePayment(payload),
  });
}

export function useExecutePayment(organizationId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (paymentID: string) => executePayment(paymentID),
    onSuccess: () => {
      if (organizationId) {
        queryClient.invalidateQueries({
          queryKey: ["organizations", organizationId, "subscription"],
        });
        queryClient.invalidateQueries({
          queryKey: ["organizations", organizationId],
        });
      }
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard-stats"] });
    },
  });
}

export function usePaymentById(id: string | null) {
  return useQuery({
    queryKey: ["payments", id],
    queryFn: () => getPaymentById(id as string),
    enabled: !!id,
    retry: false,
  });
}
