import type { Metadata } from "next";
import { Suspense } from "react";
import BillingHistory, {
  BillingHistorySkeleton,
} from "@/components/modules/profile/billing-history";

export const metadata: Metadata = {
  title: "Billing & Payments — TaskFlow",
  description:
    "Subscription plans and payment history for every organization you belong to.",
};

export default function PaymentsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">
          Billing & payments
        </h1>
        <p className="text-sm text-muted-foreground">
          Plans, renewals, and payment history per workspace. Upgrades run
          through secure bKash checkout.
        </p>
      </div>
      <Suspense fallback={<BillingHistorySkeleton />}>
        <BillingHistory />
      </Suspense>
    </div>
  );
}
