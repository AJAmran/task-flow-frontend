"use client";

import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { Eye, EyeClosed } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useLogin } from "@/hooks";
import { resolveLanding, setSessionLanding } from "@/lib/session";
import { loginSchema } from "@/validation/auth.validation";
import GoogleLoginComponent from "../modules/google-login/GoogleLogin";
import { Button } from "../ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "../ui/field";
import { Input } from "../ui/input";
import { Spinner } from "../ui/spinner";
import { toast } from "../ui/toast";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const { mutate: login, isPending: loginPending } = useLogin();
  const [demoPending, setDemoPending] = useState<string | null>(null);

  const demoAccounts = [
    {
      key: "admin",
      label: "Admin",
      hint: "Users, orgs & audit logs",
      email: "superadmin@gmail.com",
      password: "Super@admin12345",
    },
    {
      key: "owner",
      label: "Owner",
      hint: "Orgs, teams & billing",
      email: "amran.xgroup@gmail.com",
      password: "Owner@123",
    },
    {
      key: "member",
      label: "Member",
      hint: "Projects, sprints & tasks",
      email: "mdamranhossen77@gmail.com",
      password: "Member@123",
    },
  ] as const;

  const handleDemoLogin = (account: (typeof demoAccounts)[number]) => {
    setDemoPending(account.key);
    login(
      { email: account.email, password: account.password },
      {
        onSuccess: (res) => {
          setDemoPending(null);
          handleSuccess(res.data?.user?.platformRole);
        },
        onError: (err) => {
          setDemoPending(null);
          handleError(err as Error);
        },
      },
    );
  };

  const callbackUrl = searchParams.get("callbackUrl");
  const safeCallback = resolveLanding(callbackUrl);

  const handleSuccess = (platformRole?: string) => {
    const landing =
      platformRole === "SUPER_ADMIN" && safeCallback === "/dashboard"
        ? "/admin"
        : safeCallback;
    setSessionLanding(landing);
    queryClient.invalidateQueries({ queryKey: ["user"] });
    toast.add({
      title: "Login Success",
      description: "Welcome back",
      type: "success",
    });
    router.push(landing);
  };

  const handleError = (err: Error) => {
    toast.add({
      title: "Authorization failure",
      description: err.message || "Something went wrong. Please try again",
      type: "error",
    });
  };

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: loginSchema,
    },
    onSubmit: ({ value }) => {
      const loginData = {
        email: value.email,
        password: value.password,
      };

      login(loginData, {
        onSuccess: (res) => handleSuccess(res.data?.user?.platformRole),
        onError: handleError,
      });
    },
  });

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight">
          Login to your account
        </h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your email below to login to your account
        </p>
      </div>

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
                  <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="email"
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    value={field.state.value}
                    autoComplete="email"
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="password">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                  <div className="relative">
                    <Input
                      id={field.name}
                      name={field.name}
                      type={showPassword ? "text" : "password"}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      value={field.state.value}
                      autoComplete="current-password"
                      aria-invalid={isInvalid}
                    />
                    <button
                      className="absolute right-3 top-1/2 -translate-y-1/2"
type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
          >
                      {showPassword ? (
                        <EyeClosed className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <Button disabled={loginPending} type="submit">
            {loginPending ? (
              <>
                <Spinner /> submitting
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </FieldGroup>
      </form>

      <FieldSeparator>Or continue with</FieldSeparator>

      <GoogleLoginComponent />

      <FieldSeparator>Quick demo login</FieldSeparator>

      <fieldset className="grid grid-cols-3 gap-2">
        <legend className="sr-only">Demo logins</legend>
        {demoAccounts.map((account) => (
          <Button
            key={account.key}
            type="button"
            variant="outline"
            size="sm"
            className="flex h-auto flex-col items-center gap-0.5 py-2"
            disabled={loginPending || demoPending !== null}
            onClick={() => handleDemoLogin(account)}
            aria-label={`Demo login as ${account.label}`}
          >
            <span className="flex items-center gap-1 font-semibold">
              {demoPending === account.key && <Spinner />}
              {account.label}
            </span>
            <span className="text-center text-[11px] leading-tight text-muted-foreground">
              {account.hint}
            </span>
          </Button>
        ))}
      </fieldset>

      <div className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-medium underline underline-offset-4 hover:text-primary"
        >
          Register
        </Link>
      </div>
    </div>
  );
}
