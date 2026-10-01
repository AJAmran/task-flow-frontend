import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Logo } from "@/assets/logo";
import LoginForm from "@/components/form/login-form";
import { Spinner } from "@/components/ui/spinner";

export const metadata: Metadata = {
  title: "Login — TaskFlow",
  description:
    "Log in to TaskFlow with email or Google, or use a one-click demo account for Admin, Owner, or Member.",
};

export default function LoginPage() {
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
          <div className="w-full max-w-sm">
            <Suspense
              fallback={
                <div className="flex justify-center py-10">
                  <Spinner />
                </div>
              }
            >
              <LoginForm />
            </Suspense>
          </div>
        </div>
      </div>
      <div className="relative hidden overflow-hidden bg-[#0a2e36] lg:block">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(45,212,191,0.3),transparent_50%),radial-gradient(circle_at_90%_85%,rgba(45,212,191,0.18),transparent_50%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.12] bg-[radial-gradient(rgba(255,255,255,0.8)_1px,transparent_1px)] bg-[size:22px_22px]"
        />
        <div className="relative flex h-full flex-col justify-between p-10">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold text-white"
          >
            <Logo href="" />
            <span>TaskFlow</span>
          </Link>
          <div className="flex flex-col gap-6">
            <p className="max-w-md text-2xl font-bold tracking-tight text-balance text-white">
              Plan sprints, track tasks, and ship with your whole team.
            </p>
            <ul className="flex flex-col gap-3">
              {[
                ["Admin", "Users, organizations & audit logs"],
                ["Owner", "Organizations, teams & billing"],
                ["Member", "Projects, sprints & tasks"],
              ].map(([role, text]) => (
                <li key={role} className="flex items-center gap-3">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-white/10 text-xs font-bold text-teal-200">
                    {role[0]}
                  </span>
                  <span className="text-sm text-teal-50">
                    <span className="font-semibold">{role}</span>
                    <span className="text-teal-100/70"> — {text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <p className="max-w-md text-xs text-teal-100/60">
            Evaluating? Use a Quick Demo Login button — no typing needed.
          </p>
        </div>
      </div>
    </div>
  );
}
