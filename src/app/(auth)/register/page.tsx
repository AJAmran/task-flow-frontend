import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/assets/logo";
import RegisterForm from "@/components/form/register-form";

export const metadata: Metadata = {
  title: "Create Account — TaskFlow",
  description:
    "Sign up for TaskFlow free. Verify your email, create an organization, and invite your team.",
};

export default function RegisterPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="flex items-center gap-2">
              <Logo href="" />
              <span>Taskflow</span>
            </div>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold tracking-tight">
                  Create an account
                </h1>
                <p className="text-balance text-sm text-muted-foreground">
                  Enter your details below to create your account
                </p>
              </div>
              <RegisterForm />
              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
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
      </div>
      <div className="relative hidden bg-muted lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-muted to-muted" />
      </div>
    </div>
  );
}
