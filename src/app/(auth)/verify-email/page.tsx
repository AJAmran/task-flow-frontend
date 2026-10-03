import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/assets/logo";
import VerifyEmailForm from "@/components/form/verify-email-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Verify Email — TaskFlow",
  description:
    "Enter the 6-digit code sent to your email to verify your TaskFlow account.",
};

export default function VerifyEmailPage() {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center gap-6 overflow-hidden bg-gradient-to-b from-teal-50/60 via-background to-background p-6 md:p-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_50%_60%_at_50%_0%,rgba(45,212,191,0.15),transparent)]"
      />
      <div className="relative flex w-full max-w-sm flex-col gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 self-center font-medium"
        >
          <Logo href="" />
          <span>TaskFlow</span>
        </Link>
        <Card className="shadow-md">
          <CardHeader className="items-center text-center">
            <CardTitle className="text-2xl">Check your inbox</CardTitle>
            <CardDescription className="text-balance">
              Enter the 6-digit code below to verify your account. The code
              expires in 10 minutes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <VerifyEmailForm />
          </CardContent>
        </Card>
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <Link
            href="/login"
            className="font-medium underline underline-offset-4 hover:text-primary"
          >
            Back to login
          </Link>
          <span aria-hidden>·</span>
          <Link
            href="/register"
            className="font-medium underline underline-offset-4 hover:text-primary"
          >
            Wrong email? Start over
          </Link>
        </div>
      </div>
    </div>
  );
}
