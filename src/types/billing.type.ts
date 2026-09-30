export type SubscriptionPlan = "FREE" | "PRO" | "TEAM";

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
