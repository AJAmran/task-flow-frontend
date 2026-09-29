import apiClient from "@/lib/apiClient";
import type { AcceptInvitationPayload } from "@/types";

export function acceptInvitation(payload: AcceptInvitationPayload) {
  return apiClient("/organizations/invitations/accept", {
    method: "POST",
    body: payload,
  });
}
