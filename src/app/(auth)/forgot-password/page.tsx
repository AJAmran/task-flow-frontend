import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/assets/logo";
import ForgotPasswordForm from "@/components/form/forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot Password — TaskFlow",
  description:
    "Request a password reset code for your TaskFlow account.",
};

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-medium self-center"
        >
          <Logo href="" />
          <span>Taskflow</span>
        </Link>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold tracking-tight">
              Forgot Password
            </h1>
            <p className="text-balance text-sm text-muted-foreground">
              Enter your email address and we will send you a verification
              code to reset your password.
            </p>
          </div>
          <ForgotPasswordForm />
          <p className="text-center text-sm text-muted-foreground">
            Remember your password?{" "}
            <Link
              href="/login"
              className="font-medium underline underline-offset-4 hover:text-primary"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
