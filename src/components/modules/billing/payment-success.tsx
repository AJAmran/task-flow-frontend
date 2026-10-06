"use client";

import { ArrowRight, BadgeCheck, CalendarDays, CheckCircle2, Copy, CreditCard, Hash, Loader2, Wallet, XCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import AuthGuard from "@/components/auth/auth-guard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { useExecutePayment, useOrganization, usePaymentById, useSubscription } from "@/hooks";
import { clearPendingPayment, readPendingPayment } from "@/lib/pending-payment";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const [paymentDbId, setPaymentDbId] = useState<string | null>(null);
  const [paymentID, setPaymentID] = useState<string | null>(null);
  const [pendingOrgId, setPendingOrgId] = useState<string | undefined>(
    undefined,
  );
  const [copied, setCopied] = useState(false);

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

  const { data: orgData } = useOrganization(payment?.organizationId ?? "");
  const { data: subData } = useSubscription(payment?.organizationId ?? "");
  const orgName = orgData?.data?.organization?.name;
  const plan = subData?.data?.plan;

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

  const handleCopyTrx = async () => {
    if (!payment?.trxID) {
      return;
    }
    try {
      await navigator.clipboard.writeText(payment.trxID);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.add({
        title: "Copy failed",
        description: "Please copy the transaction ID manually",
        type: "error",
      });
    }
  };

  const succeeded = status === "SUCCESS";
  const failed = status === "CANCELLED" || status === "FAILED";

  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-muted/30 p-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_60%_60%_at_50%_0%,rgba(45,212,191,0.18),transparent)]"
      />
      <Card className="relative w-full max-w-md overflow-hidden">
        <div
          aria-hidden
          className={`h-1.5 w-full ${succeeded ? "bg-gradient-to-r from-teal-500 via-emerald-400 to-teal-500" : failed ? "bg-muted-foreground/20" : "bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400"}`}
        />
        <CardHeader className="items-center text-center">
          {isPending ? (
            <span className="flex size-16 items-center justify-center rounded-full bg-muted">
              <Loader2 className="size-8 animate-spin text-muted-foreground" />
            </span>
          ) : succeeded ? (
            <span className="relative flex size-16 items-center justify-center">
              <span className="absolute inset-0 animate-ping rounded-full bg-emerald-200/60" />
              <span className="relative flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-600/20">
                <CheckCircle2 className="size-8 text-white" />
              </span>
            </span>
          ) : (
            <span className="flex size-16 items-center justify-center rounded-full bg-amber-100">
              <XCircle className="size-8 text-amber-600" />
            </span>
          )}
          <CardTitle className="text-xl">
            {isPending
              ? "Checking payment..."
              : succeeded
                ? "Payment successful"
                : failed
                  ? "Payment did not go through"
                  : "Confirm your payment"}
          </CardTitle>
          <CardDescription>
            {isPending
              ? "Reading the payment record."
              : succeeded
                ? `${orgName ? `${orgName} is now` : "Your workspace is"} on the ${plan ?? ""} plan.`
                : failed
                  ? "No money moved for this attempt. Start a fresh upgrade from billing."
                  : "Paid in the bKash checkout? Press confirm to activate your plan."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
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
          {payment && !isPending && (
            <div className="overflow-hidden rounded-xl border">
              <div className="flex items-center justify-between bg-muted/50 px-4 py-2.5">
                <span className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  <Wallet className="size-3.5" /> Receipt
                </span>
                <Badge
                  className={
                    succeeded
                      ? "bg-emerald-100 text-emerald-900"
                      : failed
                        ? "bg-red-100 text-red-900"
                        : "bg-amber-100 text-amber-900"
                  }
                >
                  {status?.toLowerCase()}
                </Badge>
              </div>
              <dl className="flex flex-col gap-2.5 px-4 py-3 text-sm">
                <div className="flex items-center justify-between gap-2">
                  <dt className="flex items-center gap-1.5 text-muted-foreground">
                    <CreditCard className="size-3.5" /> Amount
                  </dt>
                  <dd className="text-base font-bold">
                    ৳{payment.amount} {payment.currency}
                  </dd>
                </div>
                <Separator />
                {payment.trxID && (
                  <>
                    <div className="flex items-center justify-between gap-2">
                      <dt className="flex items-center gap-1.5 text-muted-foreground">
                        <Hash className="size-3.5" /> Transaction ID
                      </dt>
                      <dd className="flex items-center gap-1.5">
                        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs font-semibold">
                          {payment.trxID}
                        </code>
                        <button
                          type="button"
                          onClick={handleCopyTrx}
                          aria-label="Copy transaction ID"
                          className="flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                          {copied ? (
                            <BadgeCheck className="size-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="size-3.5" />
                          )}
                        </button>
                      </dd>
                    </div>
                    <Separator />
                  </>
                )}
                <div className="flex items-center justify-between gap-2">
                  <dt className="flex items-center gap-1.5 text-muted-foreground">
                    <CalendarDays className="size-3.5" /> Date
                  </dt>
                  <dd className="font-medium">
                    {new Date(payment.createdAt).toLocaleDateString("en", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </dd>
                </div>
              </dl>
            </div>
          )}
          {paymentDbId && !succeeded && !isPending && (
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
          {succeeded && (
            <div className="flex gap-2">
              <Button
                className="flex-1"
                render={<Link href="/dashboard/payments">Back to billing</Link>}
              >
                Back to billing <ArrowRight className="size-4" />
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                render={<Link href="/dashboard">Dashboard</Link>}
              >
                Dashboard
              </Button>
            </div>
          )}
          {!succeeded && (
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
          )}
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
