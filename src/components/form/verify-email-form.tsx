"use client";

import { useForm } from "@tanstack/react-form";
import { Button } from "../ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "../ui/field";
import { useResendOtp, useVerifyAccount } from "@/hooks";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "../ui/toast";
import { Spinner } from "../ui/spinner";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { Suspense } from "react";

function VerifyEmailFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const { mutate: verify, isPending: verifyPending } = useVerifyAccount();
  const { mutate: resendOtp, isPending: resendPending } = useResendOtp();

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
        onSuccess: () => {
          toast.add({
            title: "Verification Success",
            description: "Your email has been verified. You can now log in.",
            type: "success",
          });
          router.push("/login");
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
        <form.Field name="otp">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid} className="items-center">
                <FieldLabel htmlFor={field.name} className="sr-only">Verification Code</FieldLabel>
                <InputOTP
                  maxLength={6}
                  value={field.state.value}
                  onChange={(val) => field.handleChange(val)}
                  onBlur={field.handleBlur}
                  id={field.name}
                  aria-invalid={isInvalid}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
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
          disabled={resendPending || !email}
          type="button"
          variant="outline"
          className="w-full"
          onClick={() =>
            resendOtp(
              { email },
              {
                onSuccess: () => {
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
          ) : (
            "Resend OTP"
          )}
        </Button>
      </FieldGroup>
    </form>
  );
}

export default function VerifyEmailForm() {
  return (
    <Suspense fallback={<div className="flex justify-center"><Spinner /></div>}>
      <VerifyEmailFormContent />
    </Suspense>
  );
}
