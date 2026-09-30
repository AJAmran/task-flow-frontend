"use client";

import { useForm } from "@tanstack/react-form";
import { useUpdateOrganization } from "@/hooks";
import {
  type UpdateOrganizationInput,
  updateOrganizationSchema,
} from "@/validation/organization.validation";
import { Button } from "../ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Spinner } from "../ui/spinner";
import { toast } from "../ui/toast";

export default function UpdateOrganizationForm({
  organizationId,
  initialName,
  initialSlug,
  onSuccess,
}: {
  organizationId: string;
  initialName: string;
  initialSlug: string;
  onSuccess?: () => void;
}) {
  const { mutate: update, isPending } = useUpdateOrganization(organizationId);

  const form = useForm({
    defaultValues: {
      name: initialName,
      slug: initialSlug,
    } as UpdateOrganizationInput,
    validators: {
      onSubmit: updateOrganizationSchema,
    },
    onSubmit: ({ value }) => {
      update(
        {
          ...(value.name?.trim() ? { name: value.name.trim() } : {}),
          ...(value.slug?.trim()
            ? { slug: value.slug.trim().toLowerCase() }
            : {}),
        },
        {
          onSuccess: () => {
            toast.add({
              title: "Organization updated",
              description: "Changes are live for all members.",
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
                <FieldLabel htmlFor={field.name}>Organization name</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value ?? ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  autoComplete="off"
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="slug">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Slug</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value ?? ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
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
