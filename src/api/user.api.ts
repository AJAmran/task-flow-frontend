import apiClient from "@/lib/apiClient";
import type { ApiResponse, MeUser, UpdateProfilePayload } from "@/types";

export function getMyProfile() {
  return apiClient<ApiResponse<MeUser>>("/users/me");
}

export function updateMyProfile(payload: UpdateProfilePayload) {
  return apiClient<ApiResponse<MeUser>>("/users/me", {
    method: "PATCH",
    body: payload,
  });
}
