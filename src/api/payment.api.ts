import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  InitiatePaymentPayload,
  InitiatePaymentResponse,
  SubscriptionPayment,
} from "@/types";

export function initiatePayment(payload: InitiatePaymentPayload) {
  return apiClient<ApiResponse<InitiatePaymentResponse>>("/payments/initiate", {
    method: "POST",
    body: payload,
  });
}

export function executePayment(paymentID: string) {
  return apiClient<ApiResponse<SubscriptionPayment>>("/payments/execute", {
    method: "POST",
    body: { paymentID },
  });
}

export function getPaymentById(id: string) {
  return apiClient<ApiResponse<SubscriptionPayment>>(`/payments/${id}`);
}
