import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  IForgotPasswordPayload,
  IGoogleLoginPayload,
  ILoginPayload,
  IRegisterPayload,
  IResetPasswordPayload,
  IVerifyEmailPayload,
  LoginResponse,
  MeUser,
} from "@/types";

export function userLogin(payload: ILoginPayload) {
  return apiClient<ApiResponse<LoginResponse>>("/auth/login", {
    method: "POST",
    body: payload,
  });
}

export function verifyAccount(payload: IVerifyEmailPayload) {
  return apiClient<ApiResponse<LoginResponse>>("/auth/verify-email", {
    method: "POST",
    body: payload,
  });
}

export function userRegistration(payload: IRegisterPayload) {
  return apiClient("/auth/register", { method: "POST", body: payload });
}

export function userLogout() {
  return apiClient("/auth/logout", { method: "POST" });
}

export function getMe() {
  return apiClient<ApiResponse<MeUser>>("/auth/me");
}

export function googleOAuth(payload: IGoogleLoginPayload) {
  return apiClient<ApiResponse<LoginResponse>>("/auth/google", {
    method: "POST",
    body: payload,
  });
}

export function resendOtp(payload: { email: string }) {
  return apiClient("/auth/resend-otp", { method: "POST", body: payload });
}

export function refreshToken() {
  return apiClient("/auth/refresh-token", { method: "POST" });
}

export function changePassword(
  payload: import("@/types").IChangePasswordPayload,
) {
  return apiClient("/auth/change-password", { method: "POST", body: payload });
}

export function forgotPassword(payload: IForgotPasswordPayload) {
  return apiClient("/auth/forgot-password", { method: "POST", body: payload });
}

export function resetPassword(payload: IResetPasswordPayload) {
  return apiClient("/auth/reset-password", { method: "POST", body: payload });
}
