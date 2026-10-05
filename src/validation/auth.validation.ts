import z from "zod";

const emailField = (message = "Please enter a valid email") =>
  z.string().trim().toLowerCase().pipe(z.email(message));

const passwordField = (label = "Password") =>
  z
    .string()
    .min(8, `${label} Must Minimum 8 Characters Long.`)
    .max(128, `${label} must be at most 128 characters long.`)
    .regex(/[a-z]/, `${label} must contain at least 1 Lowercase Letter`)
    .regex(/[A-Z]/, `${label} must contain at least 1 Uppercase Letter`)
    .regex(/[0-9]/, `${label} must contain at least 1 Number`)
    .regex(
      /[^A-Za-z0-9]/,
      `${label} must contain at least 1 Special Character`,
    );

export const loginSchema = z.object({
  email: emailField(),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters long")
      .max(50, "Name must be at most 50 characters long"),
    email: emailField(),
    password: passwordField(),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const verifyEmailSchema = z.object({
  email: emailField(),
  otp: z
    .string()
    .trim()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d{6}$/, "OTP must be 6 digits"),
});

export const resendOtpSchema = z.object({
  email: emailField(),
});

export const forgotPasswordSchema = z.object({
  email: emailField(),
});

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Old password is required"),
    newPassword: passwordField("New password"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const resetPasswordSchema = z
  .object({
    email: emailField(),
    otp: z
      .string()
      .trim()
      .length(6, "OTP must be 6 digits")
      .regex(/^\d{6}$/, "OTP must be 6 digits"),
    newPassword: passwordField("New password"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
