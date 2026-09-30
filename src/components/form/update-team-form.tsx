"use client";

import { useForm } from "@tanstack/react-form";
import { useUpdateTeam } from "@/hooks";
import {
  type UpdateTeamInput,
  updateTeamSchema,
} from "@/validation/organization.validation";
import { Button } from "../ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Spinner } from "../ui/spinner";
import { toast } from "../ui/toast";

export default function UpdateTeamForm({
  organizationId,
  teamId,
  currentName,
  onSuccess,
}: {
  organizationId: string;
  teamId: string;
  currentName: string;
  onSuccess?: () => void;
}) {
  const { mutate: update, isPending } = useUpdateTeam(organizationId);

  const form = useForm({
    defaultValues: {
      name: currentName,
    } as UpdateTeamInput,
    validators: {
      onSubmit: updateTeamSchema,
    },
    onSubmit: ({ value }) => {
      update(
        { teamId, payload: { name: value.name?.trim() } },
        {
          onSuccess: () => {
            toast.add({
              title: "Team renamed",
              description: `Team is now called "${value.name}".`,
              type: "success",
            });
            onSuccess?.();
          },
          onError: (err) => {
            toast.add({
              title: "Rename failed",
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
