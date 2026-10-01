"use client";

import { useForm } from "@tanstack/react-form";
import { useCreateSprint } from "@/hooks";
import {
  type CreateSprintInput,
  createSprintSchema,
} from "@/validation/sprint.validation";
import { Button } from "../ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Spinner } from "../ui/spinner";
import { toast } from "../ui/toast";

function toISODateTime(dateOnly: string): string {
  // Keep the picked calendar day stable: store as UTC midnight instead of
  // local midnight (toISOString would shift the day back for UTC+ zones).
  return `${dateOnly}T00:00:00.000Z`;
}

export default function CreateSprintForm({
  organizationId,
  projectId,
  onSuccess,
}: {
  organizationId: string;
  projectId: string;
  onSuccess?: (sprintId: string) => void;
}) {
  const { mutate: create, isPending } = useCreateSprint(
    organizationId,
    projectId,
  );

  const form = useForm({
    defaultValues: {
      name: "",
      startDate: "",
      endDate: "",
    } as unknown as CreateSprintInput,
    validators: {
      onSubmit: createSprintSchema,
    },
    onSubmit: ({ value }) => {
      create(
        {
          name: value.name.trim(),
          startDate: toISODateTime(value.startDate),
          endDate: toISODateTime(value.endDate),
        },
        {
          onSuccess: (res) => {
            toast.add({
              title: "Sprint created",
              description: `${value.name} is ready. Add tasks to fill it.`,
              type: "success",
            });
            form.reset();
            onSuccess?.(res.data?.id ?? "");
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
                <FieldLabel htmlFor={field.name}>Sprint name</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="Sprint 1"
                  autoComplete="off"
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <form.Field name="startDate">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Start date</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="date"
                    value={field.state.value as string}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="endDate">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>End date</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="date"
                    value={field.state.value as string}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
        </div>

        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Spinner /> Creating...
            </>
          ) : (
            "Create sprint"
          )}
        </Button>
      </FieldGroup>
    </form>
  );
}
