import { Logo } from "@/assets/logo";
import Link from "next/link";
import VerifyEmailForm from "@/components/form/verify-email-form";

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link href="/" className="flex items-center gap-2 font-medium self-center">
          <Logo href="" />
          <span>Taskflow</span>
        </Link>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold tracking-tight">
              Verify your email
            </h1>
            <p className="text-balance text-sm text-muted-foreground">
              We sent a verification code to your email address. Please enter it
              below.
            </p>
          </div>
          <VerifyEmailForm />
          <p className="text-center text-sm text-muted-foreground">
            Didn&apos;t receive the code?{" "}
            <button
              type="button"
              className="font-medium underline underline-offset-4 hover:text-primary"
            >
              Resend
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
