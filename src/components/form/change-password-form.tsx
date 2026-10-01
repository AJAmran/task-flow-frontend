"use client";

import { useForm } from "@tanstack/react-form";
import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";
import { useChangePassword } from "@/hooks";
import { changePasswordSchema } from "@/validation/auth.validation";
import { Button } from "../ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Spinner } from "../ui/spinner";
import { toast } from "../ui/toast";

export default function ChangePasswordForm() {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { mutate: change, isPending } = useChangePassword();

  const form = useForm({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: changePasswordSchema,
    },
    onSubmit: ({ value }) => {
      change(
        { oldPassword: value.oldPassword, newPassword: value.newPassword },
        {
          onSuccess: () => {
            toast.add({
              title: "Password changed",
              description: "Use your new password next time you log in.",
              type: "success",
            });
            form.reset();
          },
          onError: (err) => {
            toast.add({
              title: "Change failed",
              description:
                err.message || "Something went wrong. Please try again",
              type: "error",
            });
          },
        },
      );
    },
  });

  const passwordField = (
    name: "oldPassword" | "newPassword" | "confirmPassword",
    label: string,
    show: boolean,
    toggle: () => void,
  ) => (
    <form.Field key={name} name={name}>
      {(field) => {
        const isInvalid =
          field.state.meta.isTouched && !field.state.meta.isValid;

        return (
          <Field data-invalid={isInvalid}>
            <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
            <div className="relative">
              <Input
                id={field.name}
                name={field.name}
                type={show ? "text" : "password"}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                autoComplete="new-password"
                aria-invalid={isInvalid}
              />
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2"
                type="button"
                onClick={toggle}
                aria-label={show ? "Hide password" : "Show password"}
              >
                {show ? (
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
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        {passwordField("oldPassword", "Current password", showOld, () =>
          setShowOld((v) => !v),
        )}
        {passwordField("newPassword", "New password", showNew, () =>
          setShowNew((v) => !v),
        )}
        {passwordField(
          "confirmPassword",
          "Confirm new password",
          showConfirm,
          () => setShowConfirm((v) => !v),
        )}
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Spinner /> Changing...
            </>
          ) : (
            "Change password"
          )}
        </Button>
      </FieldGroup>
    </form>
  );
}
