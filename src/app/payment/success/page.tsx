import type { Metadata } from "next";
import PaymentSuccessGate from "@/components/modules/billing/payment-success";

export const metadata: Metadata = {
  title: "Payment Successful — TaskFlow",
  description:
    "Confirm a completed bKash sandbox payment and activate the workspace plan.",
};

export default function PaymentSuccessPage() {
  return <PaymentSuccessGate />;
}
