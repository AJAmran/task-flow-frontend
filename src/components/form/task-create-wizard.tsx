"use client";

import { useForm } from "@tanstack/react-form";
import { format } from "date-fns";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useCreateTask, useProject, useSprints } from "@/hooks";
import { cn } from "@/lib/utils";
import type { TaskPriority } from "@/types";
import {
  type CreateTaskInput,
  createTaskSchema,
  NO_SELECT,
} from "@/validation/task.validation";
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
import { Textarea } from "../ui/textarea";
import { toast } from "../ui/toast";

const steps = [
  { step: "01", title: "Details", description: "What needs doing" },
  { step: "02", title: "Planning", description: "Who, which sprint, when" },
  { step: "03", title: "Review", description: "Confirm and create" },
];

const priorities: TaskPriority[] = ["LOW", "MEDIUM", "HIGH", "URGENT"];

function toISODateTime(dateOnly: string): string {
  // Same UTC-midnight rule as sprints: the picked day must not shift.
  return `${dateOnly}T00:00:00.000Z`;
}

export default function TaskCreateWizard({
  organizationId,
  projectId,
  onSuccess,
}: {
  organizationId: string;
  projectId: string;
  onSuccess?: (taskId: string) => void;
}) {
  const [step, setStep] = useState(0);
  const [createdTitle, setCreatedTitle] = useState<string | null>(null);

  const { mutate: create, isPending } = useCreateTask(
    organizationId,
    projectId,
  );
  const { data: sprintsData } = useSprints(organizationId, projectId, {
    page: 1,
    limit: 100,
  });
  const { data: projectData } = useProject(organizationId, projectId);

  const sprints = (sprintsData?.data ?? []).filter(
    (s) => s.status !== "COMPLETED",
  );
  const members = projectData?.data?.members ?? [];

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      priority: "MEDIUM" as TaskPriority,
      sprintId: "",
      assigneeId: "",
      dueDate: "",
    } as CreateTaskInput,
    validators: {
      onSubmit: createTaskSchema,
    },
    onSubmit: ({ value }) => {
      create(
        {
          title: value.title.trim(),
          ...(value.description?.trim() && {
            description: value.description.trim(),
          }),
          priority: value.priority,
          ...(value.sprintId && { sprintId: value.sprintId }),
          ...(value.assigneeId && { assigneeId: value.assigneeId }),
          ...(value.dueDate && { dueDate: toISODateTime(value.dueDate) }),
        },
        {
          onSuccess: (res) => {
            setCreatedTitle(value.title.trim());
            setStep(3);
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

  const canNextFromDetails = (form.state.values.title?.trim().length ?? 0) >= 2;

  if (step === 3) {
    return (
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <CheckCircle2 className="size-12 text-teal-600" />
        <h3 className="text-lg font-bold">Task created</h3>
        <p className="max-w-sm text-sm text-muted-foreground">
          {createdTitle ? `"${createdTitle}"` : "Your task"} is on the board.
          Assign follow-ups from the task page.
        </p>
      </div>
    );
  }

  const sprintName =
    sprints.find((s) => s.id === form.state.values.sprintId)?.name ?? "Backlog";
  const assigneeName =
    members.find((m) => m.userId === form.state.values.assigneeId)?.user.name ??
    "Unassigned";

  return (
    <div className="flex flex-col gap-5">
      <ol className="grid gap-2 sm:grid-cols-3">
        {steps.map((item, index) => (
          <li key={item.step}>
            <div
              className={cn(
                "flex items-center gap-3 rounded-xl border p-3",
                index === step && "border-primary ring-1 ring-primary",
                index < step && "bg-muted/40",
              )}
              aria-current={index === step ? "step" : undefined}
            >
              <span className="text-sm font-bold text-muted-foreground">
                {item.step}
              </span>
              <span>
                <span className="block text-sm font-medium">{item.title}</span>
                <span className="block text-xs text-muted-foreground">
                  {item.description}
                </span>
              </span>
            </div>
          </li>
        ))}
      </ol>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        {step === 0 && (
          <FieldGroup>
            <form.Field name="title">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Task title</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      placeholder="Design the landing page"
                      autoComplete="off"
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="description">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>
                    Description (optional)
                  </FieldLabel>
                  <Textarea
                    id={field.name}
                    name={field.name}
                    value={field.state.value ?? ""}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="Acceptance criteria, links, context..."
                  />
                </Field>
              )}
            </form.Field>

            <form.Field name="priority">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Priority</FieldLabel>
                  <div className="grid grid-cols-4 gap-2">
                    {priorities.map((p) => (
                      <Button
                        key={p}
                        type="button"
                        variant={
                          field.state.value === p ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => field.handleChange(p)}
                      >
                        {p[0] + p.slice(1).toLowerCase()}
                      </Button>
                    ))}
                  </div>
                </Field>
              )}
            </form.Field>
          </FieldGroup>
        )}

        {step === 1 && (
          <FieldGroup>
            <form.Field name="sprintId">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Sprint</FieldLabel>
                  <Select
                    value={field.state.value || NO_SELECT}
                    onValueChange={(val: string | null) =>
                      field.handleChange(val === NO_SELECT ? "" : (val ?? ""))
                    }
                  >
                    <SelectTrigger id={field.name}>
                      <SelectValue placeholder="Backlog (no sprint)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={NO_SELECT}>
                        Backlog (no sprint)
                      </SelectItem>
                      {sprints.map((sprint) => (
                        <SelectItem key={sprint.id} value={sprint.id}>
                          {sprint.name} ({sprint.status.toLowerCase()})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )}
            </form.Field>

            <form.Field name="assigneeId">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Assignee</FieldLabel>
                  <Select
                    value={field.state.value || NO_SELECT}
                    onValueChange={(val: string | null) =>
                      field.handleChange(val === NO_SELECT ? "" : (val ?? ""))
                    }
                  >
                    <SelectTrigger id={field.name}>
                      <SelectValue placeholder="Unassigned" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={NO_SELECT}>Unassigned</SelectItem>
                      {members.map((member) => (
                        <SelectItem key={member.userId} value={member.userId}>
                          {member.user.name} ({member.user.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )}
            </form.Field>

            <form.Field name="dueDate">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>
                    Due date (optional)
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="date"
                    value={field.state.value ?? ""}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                </Field>
              )}
            </form.Field>
          </FieldGroup>
        )}

        {step === 2 && (
          <dl className="flex flex-col gap-3 rounded-xl border bg-muted/30 p-4">
            {[
              ["Title", form.state.values.title],
              ["Priority", form.state.values.priority],
              ["Description", form.state.values.description?.trim() || "—"],
              ["Sprint", sprintName],
              ["Assignee", assigneeName],
              [
                "Due date",
                form.state.values.dueDate
                  ? format(
                      new Date(`${form.state.values.dueDate}T00:00:00`),
                      "MMM d, yyyy",
                    )
                  : "No due date",
              ],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4 text-sm">
                <dt className="shrink-0 text-muted-foreground">{label}</dt>
                <dd className="text-right font-medium break-words">{value}</dd>
              </div>
            ))}
          </dl>
        )}

        <div className="mt-5 flex justify-between gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={step === 0 || isPending}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
          >
            <ArrowLeft /> Back
          </Button>
          {step < 2 ? (
            <Button
              type="button"
              disabled={(step === 0 && !canNextFromDetails) || isPending}
              onClick={() => setStep((s) => Math.min(2, s + 1))}
            >
              Continue <ArrowRight />
            </Button>
          ) : (
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create task"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
