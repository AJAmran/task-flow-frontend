import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import registerImage from "@/assets/images/registerimg.png";
import { Logo } from "@/assets/logo";
import RegisterForm from "@/components/form/register-form";
import { Spinner } from "@/components/ui/spinner";

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
              <Suspense
                fallback={
                  <div className="flex justify-center py-10">
                    <Spinner />
                  </div>
                }
              >
                <RegisterForm />
              </Suspense>
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
      <div className="relative hidden overflow-hidden bg-[#0a2e36] lg:block">
        <Image
          src={registerImage}
          alt="Get started with TaskFlow"
          fill
          priority
          placeholder="blur"
          sizes="(max-width:1024px) 0vw, 50vw"
          className="object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-[#0a2e36]/90 via-[#0a2e36]/30 to-[#0a2e36]/20"
        />
      </div>
    </div>
  );
}
