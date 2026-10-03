"use client";

import { useForm } from "@tanstack/react-form";
import { useCreateProject, useTeams } from "@/hooks";
import { getApiErrorMessage } from "@/lib/apiError";
import {
  LIMIT_UPGRADE_SUFFIX,
  isLimitError,
} from "@/components/modules/billing/plan-usage";
import {
  type CreateProjectInput,
  createProjectSchema,
} from "@/validation/project.validation";
import { Button } from "../ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Spinner } from "../ui/spinner";
import { Textarea } from "../ui/textarea";
import { toast } from "../ui/toast";

export default function CreateProjectForm({
  organizationId,
  onSuccess,
}: {
  organizationId: string;
  onSuccess?: (projectId: string) => void;
}) {
  const { mutate: create, isPending } = useCreateProject(organizationId);
  const { data: teamsData } = useTeams(organizationId, {
    page: 1,
    limit: 100,
  });
  const teams = teamsData?.data ?? [];

  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      teamId: "",
    } as CreateProjectInput,
    validators: {
      onSubmit: createProjectSchema,
    },
    onSubmit: ({ value }) => {
      create(
        {
          name: value.name.trim(),
          ...(value.description?.trim() && {
            description: value.description.trim(),
          }),
          ...(value.teamId && { teamId: value.teamId }),
        },
        {
          onSuccess: (res) => {
            toast.add({
              title: "Project created",
              description: `${value.name} is ready. Add sprints and tasks next.`,
              type: "success",
            });
            form.reset();
            onSuccess?.(res.data?.id ?? "");
          },
          onError: (err) => {
            const limited = isLimitError(err);
            toast.add({
              title: limited ? "Plan limit reached" : "Creation failed",
              description:
                getApiErrorMessage(err) +
                (limited ? LIMIT_UPGRADE_SUFFIX : ""),
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
                <FieldLabel htmlFor={field.name}>Project name</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="Website redesign"
                  autoComplete="off"
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="description">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>
                  Description (optional)
                </FieldLabel>
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value ?? ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="What will this project deliver?"
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="teamId">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Team (optional)</FieldLabel>
                <Select
                  value={field.state.value || undefined}
                  onValueChange={(val: string | null) =>
                    field.handleChange(val ?? "")
                  }
                >
                  <SelectTrigger id={field.name} aria-invalid={isInvalid}>
                    <SelectValue placeholder="Select a team" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
            "Create project"
          )}
        </Button>
      </FieldGroup>
    </form>
  );
}
