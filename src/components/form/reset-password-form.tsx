"use client";

import { useForm } from "@tanstack/react-form";
import { Eye, EyeClosed } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useResetPassword } from "@/hooks";
import { resetPasswordSchema } from "@/validation/auth.validation";
import { Button } from "../ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { Spinner } from "../ui/spinner";
import { toast } from "../ui/toast";

function ResetPasswordFormContent() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const { mutate: resetPassword, isPending } = useResetPassword();

  const form = useForm({
    defaultValues: {
      email,
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: resetPasswordSchema,
    },
    onSubmit: ({ value }) => {
      if (!email) {
        toast.add({
          title: "Error",
          description: "Email address is missing. Please restart the process.",
          type: "error",
        });
        return;
      }

      const resetData = {
        email,
        otp: value.otp,
        newPassword: value.newPassword,
      };

      resetPassword(resetData, {
        onSuccess: () => {
          toast.add({
            title: "Password reset successful",
            description: "You can now log in with your new password",
            type: "success",
          });
          router.push("/login");
        },
        onError: (err) => {
          toast.add({
            title: "Reset failed",
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
                <FieldLabel htmlFor={field.name} className="self-start">
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

        <form.Field name="newPassword">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>New Password</FieldLabel>
                <div className="relative">
                  <Input
                    id={field.name}
                    name={field.name}
                    type={showPassword ? "text" : "password"}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    value={field.state.value}
                    autoComplete="new-password"
                    aria-invalid={isInvalid}
                  />
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2"
type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
            >
                    {showPassword ? (
                      <EyeClosed className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="confirmPassword">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>
                  Confirm New Password
                </FieldLabel>
                <div className="relative">
                  <Input
                    id={field.name}
                    name={field.name}
                    type={showConfirmPassword ? "text" : "password"}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    value={field.state.value}
                    autoComplete="new-password"
                    aria-invalid={isInvalid}
                  />
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2"
type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
              aria-pressed={showConfirmPassword}
            >
                    {showConfirmPassword ? (
                      <EyeClosed className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <Button disabled={isPending} type="submit" className="w-full">
          {isPending ? (
            <>
              <Spinner /> submitting
            </>
          ) : (
            "Reset Password"
          )}
        </Button>
      </FieldGroup>
    </form>
  );
}

export default function ResetPasswordForm() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center">
          <Spinner />
        </div>
      }
    >
      <ResetPasswordFormContent />
    </Suspense>
  );
}
