"use client";

import { useForm } from "@tanstack/react-form";
import { useInviteMember } from "@/hooks";
import { getApiErrorMessage, getApiErrorStatus } from "@/lib/apiError";
import {
  LIMIT_UPGRADE_SUFFIX,
  isLimitError,
} from "@/components/modules/billing/plan-usage";
import { cn } from "@/lib/utils";
import type { OrgRole } from "@/types";
import {
  type InviteMemberInput,
  inviteMemberSchema,
} from "@/validation/organization.validation";
import { Button } from "../ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Spinner } from "../ui/spinner";
import { toast } from "../ui/toast";

const roles: { value: OrgRole; label: string; hint: string }[] = [
  {
    value: "MEMBER",
    label: "Member",
    hint: "Can view and collaborate",
  },
  {
    value: "ORG_OWNER",
    label: "Owner",
    hint: "Can manage everything",
  },
];

export default function InviteMemberForm({
  organizationId,
  onSuccess,
}: {
  organizationId: string;
  onSuccess?: () => void;
}) {
  const { mutate: invite, isPending } = useInviteMember(organizationId);

  const form = useForm({
    defaultValues: {
      email: "",
      role: "MEMBER",
    } as InviteMemberInput,
    validators: {
      onSubmit: inviteMemberSchema,
    },
    onSubmit: ({ value }) => {
      invite(
        { email: value.email, role: value.role },
        {
          onSuccess: (res) => {
            toast.add({
              title: "Invitation sent",
              description:
                res.message ??
                `Invite sent to ${value.email}`,
              type: "success",
            });
            form.reset();
            onSuccess?.();
          },
          onError: (err) => {
            const status = getApiErrorStatus(err);
            const serverMessage = getApiErrorMessage(err);
            const alreadyInvited =
              status === 409 &&
              serverMessage.toLowerCase().includes("already exists");
            const limited = isLimitError(err);
            toast.add({
              title: alreadyInvited
                ? "Already invited"
                : limited
                  ? "Member limit reached"
                  : "Invite failed",
              description: alreadyInvited
                ? `${value.email} already has an active invitation (valid 7 days). Ask them to check inbox and spam — no need to send again.`
                : serverMessage + (limited ? LIMIT_UPGRADE_SUFFIX : ""),
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
        <form.Field name="email">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Email address</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="teammate@company.com"
                  autoComplete="off"
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="role">
          {(field) => (
            <Field>
              <FieldLabel>Role</FieldLabel>
              <div className="grid grid-cols-2 gap-2">
                {roles.map((role) => (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => field.handleChange(role.value)}
                    aria-pressed={field.state.value === role.value}
                    className={cn(
                      "flex flex-col gap-1 rounded-lg border p-3 text-left transition-colors",
                      field.state.value === role.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-muted",
                    )}
                  >
                    <span className="text-sm font-medium">{role.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {role.hint}
                    </span>
                  </button>
                ))}
              </div>
            </Field>
          )}
        </form.Field>

        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Spinner /> Sending...
            </>
          ) : (
            "Send invitation"
          )}
        </Button>
      </FieldGroup>
    </form>
  );
}
