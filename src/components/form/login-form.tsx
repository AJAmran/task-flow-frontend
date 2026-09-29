"use client";

import { useForm } from "@tanstack/react-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "../ui/field";
import { useState } from "react";
import { Crown, Eye, EyeClosed, ShieldCheck, User } from "lucide-react";
import { useLogin } from "@/hooks";
import { useRouter } from "next/navigation";
import { toast } from "../ui/toast";
import { Spinner } from "../ui/spinner";
import Link from "next/link";
import { loginSchema } from "@/validation/auth.validation";
import GoogleLoginComponent from "../modules/google-login/GoogleLogin";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "../ui/card";

const demoAccounts = [
  {
    label: "Super Admin",
    email: "superadmin@gmail.com",
    password: "Super@admin12345",
    redirect: "/admin",
    icon: ShieldCheck,
  },
  {
    label: "Org Owner",
    email: "amran.xgroup@gmail.com",
    password: "Owner@123",
    redirect: "/dashboard",
    icon: Crown,
  },
  {
    label: "Member",
    email: "mdamranhossen77@gmail.com",
    password: "Member@123",
    redirect: "/dashboard",
    icon: User,
  },
] as const;

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [demoEmail, setDemoEmail] = useState<string | null>(null);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate: login, isPending: loginPending } = useLogin();

  const handleSuccess = (platformRole?: string, fallback = "/dashboard") => {
    queryClient.invalidateQueries({ queryKey: ["user"] });
    toast.add({
      title: "Login Success",
      description: "Welcome back",
      type: "success",
    });
    router.push(platformRole === "SUPER_ADMIN" ? "/admin" : fallback);
  };

  const handleError = (err: Error) => {
    setDemoEmail(null);
    toast.add({
      title: "Authorization failure",
      description: err.message || "Something went wrong. Please try again",
      type: "error",
    });
  };

  const handleDemoLogin = (account: (typeof demoAccounts)[number]) => {
    setDemoEmail(account.email);
    login(
      { email: account.email, password: account.password },
      {
        onSuccess: (res) =>
          handleSuccess(res.data?.user?.platformRole, account.redirect),
        onError: handleError,
      },
    );
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
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    value={field.state.value}
                    autoComplete="off"
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
                      autoComplete="off"
                      aria-invalid={isInvalid}
                    />
                    <button
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
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
            {loginPending && !demoEmail ? (
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

      <FieldSeparator>Quick Demo Login</FieldSeparator>

      <div className="grid gap-2">
        {demoAccounts.map((account) => {
          const Icon = account.icon;
          const isLoading = loginPending && demoEmail === account.email;
          return (
            <Card key={account.email}>
              <CardContent className="flex items-center gap-3 p-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted">
                  <Icon className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium">
                    {account.label}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {account.email}
                  </span>
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={loginPending}
                  onClick={() => handleDemoLogin(account)}
                >
                  {isLoading ? (
                    <>
                      <Spinner /> login
                    </>
                  ) : (
                    "Demo Login"
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

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
