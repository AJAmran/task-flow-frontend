"use client";

import { useForm } from "@tanstack/react-form";
import { useUpdateProfile } from "@/hooks";
import {
  type UpdateProfileInput,
  updateProfileSchema,
} from "@/validation/profile.validation";
import { Button } from "../ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Spinner } from "../ui/spinner";
import { toast } from "../ui/toast";

export default function UpdateProfileForm({
  currentName,
  currentImage,
  onSuccess,
}: {
  currentName: string;
  currentImage?: string | null;
  onSuccess?: () => void;
}) {
  const { mutate: update, isPending } = useUpdateProfile();

  const form = useForm({
    defaultValues: {
      name: currentName,
      profileImage: currentImage ?? "",
    } as UpdateProfileInput,
    validators: {
      onSubmit: updateProfileSchema,
    },
    onSubmit: ({ value }) => {
      update(
        {
          ...(value.name.trim() !== currentName && {
            name: value.name.trim(),
          }),
          ...(value.profileImage?.trim() !== (currentImage ?? "") && {
            profileImage: value.profileImage?.trim() || null,
          }),
        },
        {
          onSuccess: () => {
            toast.add({
              title: "Profile updated",
              description: "Your changes are live.",
              type: "success",
            });
            onSuccess?.();
          },
          onError: (err) => {
            toast.add({
              title: "Update failed",
              description:
                err.message || "Something went wrong. Please try again",
              type: "error",
            });
          },
        },
      );
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
        <form.Field name="name">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Full name</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  autoComplete="name"
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="profileImage">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>
                  Profile image URL (optional)
                </FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="url"
                  value={field.state.value ?? ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="https://..."
                  autoComplete="off"
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Spinner /> Saving...
            </>
          ) : (
            "Save changes"
          )}
        </Button>
      </FieldGroup>
    </form>
  );
}
