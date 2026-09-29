import { acceptInvitation } from "@/api";
import { useMutation } from "@tanstack/react-query";

export function useAcceptInvitation() {
  return useMutation({
    mutationFn: acceptInvitation,
  });
}
