"use client";

import { useForm } from "@tanstack/react-form";
import { useTeams, useUpdateProject } from "@/hooks";
import { getApiErrorMessage } from "@/lib/apiError";
import { dateOnlyValue, toISODateTime } from "@/lib/date";
import type { ProjectDetail } from "@/types";
import {
  type UpdateProjectInput,
  updateProjectSchema,
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

const NO_TEAM = "__none__";

export default function UpdateProjectForm({
  organizationId,
  project,
  onSuccess,
}: {
  organizationId: string;
  project: ProjectDetail;
  onSuccess?: () => void;
}) {
  const { mutate: update, isPending } = useUpdateProject(
    organizationId,
    project.id,
  );
  const { data: teamsData } = useTeams(organizationId, {
    page: 1,
    limit: 100,
  });
  const teams = teamsData?.data ?? [];
  const currentStart = dateOnlyValue(project.startDate);
  const currentEnd = dateOnlyValue(project.endDate);

  const form = useForm({
    defaultValues: {
      name: project.name,
      description: project.description ?? "",
      status: project.status,
      teamId: project.teamId ?? NO_TEAM,
      startDate: currentStart,
      endDate: currentEnd,
    } as UpdateProjectInput,
    validators: {
      onSubmit: updateProjectSchema,
    },
    onSubmit: ({ value }) => {
      const nextTeamId =
        value.teamId === NO_TEAM ? null : (value.teamId ?? null);
      const nextStart = value.startDate || "";
      const nextEnd = value.endDate || "";
      update(
        {
          ...(value.name?.trim() &&
            value.name.trim() !== project.name && {
              name: value.name.trim(),
            }),
          ...(value.description !== undefined && {
            description: value.description.trim() || null,
          }),
          ...(value.status &&
            value.status !== project.status && { status: value.status }),
          ...(nextTeamId !== project.teamId && { teamId: nextTeamId }),
          ...(nextStart !== currentStart && {
            startDate: nextStart ? toISODateTime(nextStart) : null,
          }),
          ...(nextEnd !== currentEnd && {
            endDate: nextEnd ? toISODateTime(nextEnd) : null,
          }),
        },
        {
          onSuccess: () => {
            toast.add({
              title: "Project updated",
              description: "Changes saved successfully.",
              type: "success",
            });
            onSuccess?.();
          },
          onError: (err) => {
            toast.add({
              title: "Update failed",
              description: getApiErrorMessage(err),
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

        <form.Field name="description">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value ?? ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
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
                    value={field.state.value || ""}
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
                    value={field.state.value || ""}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    min={form.state.values.startDate || undefined}
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <form.Field name="status">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Status</FieldLabel>
                  <Select
                    value={field.state.value}
                    onValueChange={(val: string | null) =>
                      field.handleChange(
                        (val ?? "ACTIVE") as "ACTIVE" | "ARCHIVED",
                      )
                    }
                  >
                    <SelectTrigger id={field.name} aria-invalid={isInvalid}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="ARCHIVED">Archived</SelectItem>
                    </SelectContent>
                  </Select>
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
                  <FieldLabel htmlFor={field.name}>Team</FieldLabel>
                  <Select
                    value={field.state.value ?? NO_TEAM}
                    onValueChange={(val: string | null) =>
                      field.handleChange(val ?? NO_TEAM)
                    }
                  >
                    <SelectTrigger id={field.name} aria-invalid={isInvalid}>
                      <SelectValue placeholder="No team" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={NO_TEAM}>No team</SelectItem>
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
        </div>

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
