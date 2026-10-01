import { XCircle } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Payment Cancelled — TaskFlow",
  description:
    "The checkout was cancelled. No money moved and the workspace plan is unchanged.",
};

export default function PaymentCancelPage() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-muted/30 p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="items-center text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-muted">
            <XCircle className="size-7 text-muted-foreground" />
          </span>
          <CardTitle>Payment cancelled</CardTitle>
          <CardDescription>
            The bKash checkout was closed before completion. No money moved and
            your workspace plan is unchanged.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <p className="rounded-lg border bg-muted/40 p-3 text-sm text-muted-foreground">
            To try again, open Billing & Payments and press Upgrade — a fresh
            sandbox checkout link is created every time.
          </p>
          <div className="flex gap-2">
            <Button
              className="flex-1"
              render={<Link href="/dashboard/payments">Back to billing</Link>}
            >
              Back to billing
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              render={<Link href="/pricing">Compare plans</Link>}
            >
              Compare plans
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
