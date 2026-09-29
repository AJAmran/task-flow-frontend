import apiClient from "@/lib/apiClient";
import {
  IForgotPasswordPayload,
  IGoogleLoginPayload,
  ILoginPayload,
  IRegisterPayload,
  IResetPasswordPayload,
  IVerifyEmailPayload,
} from "@/types";

export function userLogin(payload: ILoginPayload) {
  return apiClient("/auth/login", { method: "POST", body: payload });
}

export function verifyAccount(payload: IVerifyEmailPayload) {
  return apiClient("/auth/verify-email", { method: "POST", body: payload });
}

export function userRegistration(payload: IRegisterPayload) {
  return apiClient("/auth/register", { method: "POST", body: payload });
}

export function userLogout() {
  return apiClient("/auth/logout", { method: "POST" });
}

export function getMe() {
  return apiClient("/auth/me");
}

export function googleOAuth(payload: IGoogleLoginPayload) {
  return apiClient("/auth/google", { method: "POST", body: payload });
}

export function forgotPassword(payload: IForgotPasswordPayload) {
  return apiClient("/auth/forgot-password", { method: "POST", body: payload });
}

export function resetPassword(payload: IResetPasswordPayload) {
  return apiClient("/auth/reset-password", { method: "POST", body: payload });
}
