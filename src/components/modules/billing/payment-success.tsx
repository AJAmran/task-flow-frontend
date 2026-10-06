"use client";

import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import AuthGuard from "@/components/auth/auth-guard";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { useExecutePayment, usePaymentById } from "@/hooks";
import { clearPendingPayment, readPendingPayment } from "@/lib/pending-payment";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const [paymentDbId, setPaymentDbId] = useState<string | null>(null);
  const [paymentID, setPaymentID] = useState<string | null>(null);
  const [pendingOrgId, setPendingOrgId] = useState<string | undefined>(
    undefined,
  );

  useEffect(() => {
    const fromUrl =
      searchParams.get("id") ??
      searchParams.get("paymentID") ??
      searchParams.get("paymentId") ??
      null;
    if (fromUrl) {
      const dbId =
        searchParams.get("id") ?? searchParams.get("paymentId");
      setPaymentDbId(dbId);
      setPaymentID(searchParams.get("paymentID"));
      setPendingOrgId(undefined);
      return;
    }
    const saved = readPendingPayment();
    setPaymentDbId(saved?.id ?? null);
    setPaymentID(saved?.paymentID ?? null);
    setPendingOrgId(saved?.organizationId);
  }, [searchParams]);

  const { data, isPending, isError, refetch } = usePaymentById(paymentDbId);
  const { mutate: execute, isPending: executing } =
    useExecutePayment(pendingOrgId);

  const payment = data?.data;
  const status = payment?.status;

  useEffect(() => {
    if (status === "SUCCESS") {
      clearPendingPayment();
    }
  }, [status]);

  const handleConfirm = () => {
    const id = payment?.paymentID ?? paymentID;
    if (!id) {
      return;
    }
    execute(id, {
      onSuccess: () => refetch(),
      onError: (err) =>
        toast.add({
          title: "Confirmation failed",
          description: err.message || "Please try again",
          type: "error",
        }),
    });
  };

  return (
    <div className="flex min-h-svh items-center justify-center bg-muted/30 p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="items-center text-center">
          {isPending ? (
            <span className="flex size-14 items-center justify-center rounded-full bg-muted">
              <Loader2 className="size-7 animate-spin text-muted-foreground" />
            </span>
          ) : status === "SUCCESS" ? (
            <span className="flex size-14 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="size-7 text-emerald-700" />
            </span>
          ) : (
            <span className="flex size-14 items-center justify-center rounded-full bg-amber-100">
              <XCircle className="size-7 text-amber-700" />
            </span>
          )}
          <CardTitle>
            {isPending
              ? "Checking payment..."
              : status === "SUCCESS"
                ? "Payment successful"
                : status === "CANCELLED" || status === "FAILED"
                  ? "Payment did not go through"
                  : "Confirm your payment"}
          </CardTitle>
          <CardDescription>
            {isPending
              ? "Reading the payment record."
              : status === "SUCCESS"
                ? `৳${payment?.amount} received${payment?.trxID ? ` · trxID ${payment.trxID}` : ""}. Your workspace is upgraded.`
                : status === "CANCELLED" || status === "FAILED"
                  ? "No money moved for this attempt. Start a fresh upgrade from billing."
                  : "Paid in the bKash checkout? Press confirm to activate your plan."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {!paymentDbId && !paymentID && !isPending && (
            <p className="rounded-lg border bg-muted/40 p-3 text-sm text-muted-foreground">
              No payment reference found. Start an upgrade from Billing &
              Payments, complete the bKash sandbox checkout, then return here.
            </p>
          )}
          {isError && (
            <p className="rounded-lg border p-3 text-sm text-muted-foreground">
              Could not read payment status. If you just paid, press Confirm
              below.
            </p>
          )}
          {paymentDbId && status !== "SUCCESS" && !isPending && (
            <Button disabled={executing} onClick={handleConfirm}>
              {executing ? (
                <>
                  <Spinner /> Confirming...
                </>
              ) : (
                "Confirm payment now"
              )}
            </Button>
          )}
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              render={<Link href="/dashboard/payments">Back to billing</Link>}
            >
              Back to billing
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              render={<Link href="/dashboard">Dashboard</Link>}
            >
              Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PaymentSuccessGate() {
  return (
    <AuthGuard>
      <Suspense
        fallback={
          <div className="flex min-h-svh items-center justify-center">
            <Spinner />
          </div>
        }
      >
        <PaymentSuccessContent />
      </Suspense>
    </AuthGuard>
  );
}
