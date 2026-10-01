"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { useInitiatePayment } from "@/hooks";
import { savePendingPayment } from "@/lib/pending-payment";
import { cn } from "@/lib/utils";
import { type PaidPlan, PLAN_PRICES } from "@/types";

const plans: { plan: PaidPlan; blurb: string }[] = [
  { plan: "PRO", blurb: "20 projects · 50 members" },
  { plan: "TEAM", blurb: "50 projects · 200 members" },
];

export default function UpgradeButtons({
  organizationId,
  currentPlan,
}: {
  organizationId: string;
  currentPlan: string;
}) {
  const [activePlan, setActivePlan] = useState<PaidPlan | null>(null);
  const { mutate: initiate, isPending } = useInitiatePayment();

  const options = plans.filter((p) => {
    if (currentPlan === "TEAM") {
      return false;
    }
    if (currentPlan === "PRO") {
      return p.plan === "TEAM";
    }
    return true;
  });

  if (options.length === 0) {
    return null;
  }

  const handleUpgrade = (plan: PaidPlan) => {
    setActivePlan(plan);
    initiate(
      { organizationId, plan },
      {
        onSuccess: (res) => {
          const payment = res.data?.payment;
          const bkashURL = res.data?.bkashURL;
          if (!payment?.id || !payment?.paymentID || !bkashURL) {
            toast.add({
              title: "Initiation failed",
              description: "Gateway did not return a checkout URL.",
              type: "error",
            });
            setActivePlan(null);
            return;
          }
          savePendingPayment({
            id: payment.id,
            paymentID: payment.paymentID,
            organizationId,
            plan,
          });
          toast.add({
            title: "Redirecting to bKash",
            description: `Pay ৳${PLAN_PRICES[plan]} in the sandbox checkout to activate ${plan}.`,
            type: "success",
          });
          window.location.href = bkashURL;
        },
        onError: (err) => {
          setActivePlan(null);
          toast.add({
            title: "Upgrade failed",
            description: err.message || "Please try again",
            type: "error",
          });
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-teal-600/20 bg-teal-50/50 p-3">
      <p className="text-sm font-semibold">Upgrade this workspace</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map(({ plan, blurb }) => {
          const loading = isPending && activePlan === plan;
          return (
            <div
              key={plan}
              className={cn(
                "flex items-center justify-between gap-2 rounded-lg border bg-card px-3 py-2",
              )}
            >
              <span>
                <span className="block text-sm font-bold">
                  {plan} · ৳{PLAN_PRICES[plan]}
                  <span className="font-normal text-muted-foreground">/mo</span>
                </span>
                <span className="block text-xs text-muted-foreground">
                  {blurb}
                </span>
              </span>
              <Button
                size="sm"
                disabled={isPending}
                onClick={() => handleUpgrade(plan)}
              >
                {loading ? (
                  <>
                    <Spinner /> Starting...
                  </>
                ) : (
                  `Upgrade`
                )}
              </Button>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground">
        Test mode: pay with bKash sandbox wallet in the checkout page. You
        return here to confirm.
      </p>
    </div>
  );
}
