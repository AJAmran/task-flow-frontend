import { Logo } from "@/assets/logo";
import LoginForm from "@/components/form/login-form";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";
import { Suspense } from "react";

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
      <div className="relative hidden bg-muted lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-muted to-muted" />
      </div>
    </div>
  );
}