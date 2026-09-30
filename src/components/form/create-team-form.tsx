"use client";

import { useForm } from "@tanstack/react-form";
import { useCreateTeam } from "@/hooks";
import {
  type CreateTeamInput,
  createTeamSchema,
} from "@/validation/organization.validation";
import { Button } from "../ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Spinner } from "../ui/spinner";
import { toast } from "../ui/toast";

export default function CreateTeamForm({
  organizationId,
  onSuccess,
}: {
  organizationId: string;
  onSuccess?: () => void;
}) {
  const { mutate: create, isPending } = useCreateTeam(organizationId);

  const form = useForm({
    defaultValues: {
      name: "",
    } as CreateTeamInput,
    validators: {
      onSubmit: createTeamSchema,
    },
    onSubmit: ({ value }) => {
      create(
        { name: value.name.trim() },
        {
          onSuccess: () => {
            toast.add({
              title: "Team created",
              description: `${value.name} is ready. Add members to get started.`,
              type: "success",
            });
            form.reset();
            onSuccess?.();
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
                <FieldLabel htmlFor={field.name}>Team name</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="Backend squad"
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
              <Spinner /> Creating...
            </>
          ) : (
            "Create team"
          )}
        </Button>
      </FieldGroup>
    </form>
  );
}
