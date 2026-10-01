export type SubscriptionPlan = "FREE" | "PRO" | "TEAM";

export type PaidPlan = "PRO" | "TEAM";

export const PLAN_PRICES: Record<PaidPlan, number> = {
  PRO: 500,
  TEAM: 1000,
};

export type SubscriptionStatus = "TRIAL" | "ACTIVE" | "PAST_DUE" | "CANCELLED";

export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED" | "CANCELLED";

export interface SubscriptionPayment {
  id: string;
  subscriptionId: string;
  organizationId: string;
  amount: string;
  currency: string;
  paymentID: string;
  trxID: string | null;
  status: PaymentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface InitiatePaymentPayload {
  organizationId: string;
  plan: PaidPlan;
}

export interface InitiatePaymentResponse {
  payment: SubscriptionPayment;
  bkashURL: string;
}

export interface PendingPayment {
  id: string;
  paymentID: string;
  organizationId: string;
  plan: PaidPlan;
}

export interface OrgSubscriptionDetail {
  id: string;
  organizationId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  maxProjects: number;
  maxMembers: number;
  currentPeriodEnd: string | null;
  createdAt: string;
  updatedAt: string;
  payments: SubscriptionPayment[];
}
