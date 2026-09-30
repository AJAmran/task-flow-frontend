"use client";

import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { useCreateOrganization } from "@/hooks";
import {
  type CreateOrganizationInput,
  createOrganizationSchema,
} from "@/validation/organization.validation";
import { Button } from "../ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Spinner } from "../ui/spinner";
import { toast } from "../ui/toast";

const defaultValues: CreateOrganizationInput = {
  name: "",
  slug: "",
};

export default function CreateOrganizationForm({
  onSuccess,
}: {
  onSuccess?: (organizationId: string) => void;
}) {
  const router = useRouter();
  const { mutate: create, isPending } = useCreateOrganization();

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: createOrganizationSchema,
    },
    onSubmit: ({ value }) => {
      create(
        {
          name: value.name.trim(),
          ...(value.slug?.trim()
            ? { slug: value.slug.trim().toLowerCase() }
            : {}),
        },
        {
          onSuccess: (res) => {
            const organizationId = res.data?.organization?.id;
            toast.add({
              title: "Organization created",
              description: `${res.data?.organization?.name ?? "Workspace"} is ready. You are the owner.`,
              type: "success",
            });
            if (onSuccess && organizationId) {
              onSuccess(organizationId);
              return;
            }
            router.push(
              organizationId
                ? `/organizations/${organizationId}`
                : "/organizations",
            );
          },
          onError: (err) => {
            toast.add({
              title: "Creation failed",
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
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="Acme Inc"
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
                <FieldLabel htmlFor={field.name}>
                  Slug <span className="font-normal">(optional)</span>
                </FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value ?? ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="acme-inc"
                  autoComplete="off"
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
                <p className="text-xs text-muted-foreground">
                  Lowercase letters, numbers and hyphens only. Leave empty to
                  auto-generate.
                </p>
              </Field>
            );
          }}
        </form.Field>

        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Spinner /> Creating...
            </>
          ) : (
            "Create organization"
          )}
        </Button>
      </FieldGroup>
    </form>
  );
}
