"use client";

import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { Mail, MailWarning } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useResendOtp, useVerifyAccount } from "@/hooks";
import { setSessionLanding } from "@/lib/session";
import { Button } from "../ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { Spinner } from "../ui/spinner";
import { toast } from "../ui/toast";

function VerifyEmailFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const planParam = searchParams.get("plan");
  const plan = planParam === "PRO" || planParam === "TEAM" ? planParam : null;

  const { mutate: verify, isPending: verifyPending } = useVerifyAccount();
  const { mutate: resendOtp, isPending: resendPending } = useResendOtp();
  const queryClient = useQueryClient();
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) {
      return;
    }
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const form = useForm({
    defaultValues: {
      otp: "",
    },
    validators: {
      onSubmit({ value }) {
        if (!value.otp || value.otp.length < 6) {
          return "Please enter a valid 6-digit code";
        }
      },
    },
    onSubmit: ({ value }) => {
      if (!email) {
        toast.add({
          title: "Error",
          description: "Email address is missing. Please try logging in again.",
          type: "error",
        });
        return;
      }

      const verifyData = {
        email,
        otp: value.otp,
      };

      verify(verifyData, {
        onSuccess: (res) => {
          const isAdmin = res.data?.user?.platformRole === "SUPER_ADMIN";
          const landing = isAdmin
            ? "/admin"
            : plan
              ? `/dashboard/payments?plan=${plan}`
              : "/dashboard";
          setSessionLanding(landing);
          queryClient.invalidateQueries({ queryKey: ["user"] });
          toast.add({
            title: "Verification Success",
            description: "Your email has been verified. Welcome!",
            type: "success",
          });
          router.push(landing);
        },
        onError: (err) => {
          toast.add({
            title: "Verification failed",
            description:
              err.message || "Invalid or expired code. Please try again",
            type: "error",
          });
        },
      });
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        {email ? (
          <p className="flex items-center justify-center gap-2 rounded-lg bg-teal-600/10 px-3 py-2 text-sm font-medium text-teal-900">
            <Mail className="size-4 shrink-0" />
            <span className="truncate">{email}</span>
          </p>
        ) : (
          <p className="flex items-center justify-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800">
            <MailWarning className="size-4 shrink-0" />
            No email in link — go back and register again.
          </p>
        )}
        <form.Field name="otp">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid} className="items-center">
                <FieldLabel htmlFor={field.name} className="sr-only">
                  Verification Code
                </FieldLabel>
                <InputOTP
                  maxLength={6}
                  value={field.state.value}
                  onChange={(val) => field.handleChange(val)}
                  onComplete={() => form.handleSubmit()}
                  onBlur={field.handleBlur}
                  id={field.name}
                  aria-invalid={isInvalid}
                  containerClassName="justify-center"
                >
                  <InputOTPGroup className="w-full justify-center gap-1.5 sm:gap-2">
                    <InputOTPSlot index={0} className="size-10 rounded-xl border-2 text-base font-bold transition-all first:rounded-xl last:rounded-xl focus-within:border-teal-500 data-[active=true]:border-teal-500 data-[active=true]:ring-2 data-[active=true]:ring-teal-500/30 sm:size-12 sm:text-lg" />
                    <InputOTPSlot index={1} className="size-10 rounded-xl border-2 text-base font-bold transition-all first:rounded-xl last:rounded-xl focus-within:border-teal-500 data-[active=true]:border-teal-500 data-[active=true]:ring-2 data-[active=true]:ring-teal-500/30 sm:size-12 sm:text-lg" />
                    <InputOTPSlot index={2} className="size-10 rounded-xl border-2 text-base font-bold transition-all first:rounded-xl last:rounded-xl focus-within:border-teal-500 data-[active=true]:border-teal-500 data-[active=true]:ring-2 data-[active=true]:ring-teal-500/30 sm:size-12 sm:text-lg" />
                    <InputOTPSlot index={3} className="size-10 rounded-xl border-2 text-base font-bold transition-all first:rounded-xl last:rounded-xl focus-within:border-teal-500 data-[active=true]:border-teal-500 data-[active=true]:ring-2 data-[active=true]:ring-teal-500/30 sm:size-12 sm:text-lg" />
                    <InputOTPSlot index={4} className="size-10 rounded-xl border-2 text-base font-bold transition-all first:rounded-xl last:rounded-xl focus-within:border-teal-500 data-[active=true]:border-teal-500 data-[active=true]:ring-2 data-[active=true]:ring-teal-500/30 sm:size-12 sm:text-lg" />
                    <InputOTPSlot index={5} className="size-10 rounded-xl border-2 text-base font-bold transition-all first:rounded-xl last:rounded-xl focus-within:border-teal-500 data-[active=true]:border-teal-500 data-[active=true]:ring-2 data-[active=true]:ring-teal-500/30 sm:size-12 sm:text-lg" />
                  </InputOTPGroup>
                </InputOTP>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <Button disabled={verifyPending} type="submit" className="w-full">
          {verifyPending ? (
            <>
              <Spinner /> verifying
            </>
          ) : (
            "Verify Email"
          )}
        </Button>

        <Button
          disabled={resendPending || !email || cooldown > 0}
          type="button"
          variant="outline"
          className="w-full"
          onClick={() =>
            resendOtp(
              { email },
              {
                onSuccess: () => {
                  setCooldown(30);
                  toast.add({
                    title: "OTP resent",
                    description: "Please check your email for a new code",
                    type: "success",
                  });
                },
                onError: (err) => {
                  toast.add({
                    title: "Resend failed",
                    description:
                      err.message || "Something went wrong. Please try again",
                    type: "error",
                  });
                },
              },
            )
          }
        >
          {resendPending ? (
            <>
              <Spinner /> resending
            </>
          ) : cooldown > 0 ? (
            `Resend in ${cooldown}s`
          ) : (
            "Resend code"
          )}
        </Button>
      </FieldGroup>
    </form>
  );
}

export default function VerifyEmailForm() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center">
          <Spinner />
        </div>
      }
    >
      <VerifyEmailFormContent />
    </Suspense>
  );
}
