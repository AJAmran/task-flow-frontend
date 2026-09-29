"use client";

import { Button } from "../ui/button";
import { useAcceptInvitation } from "@/hooks";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { toast } from "../ui/toast";
import { Spinner } from "../ui/spinner";
import { Card, CardContent } from "../ui/card";

function AcceptInvitationFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const { mutate: accept, isPending } = useAcceptInvitation();

  if (!token) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-sm text-muted-foreground">
          Invitation token is missing. Please open the invitation link from
          your email again.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-6 text-center">
        <h1 className="text-xl font-bold tracking-tight">
          Organization Invitation
        </h1>
        <p className="text-sm text-muted-foreground">
          You have been invited to join an organization on TaskFlow. Accept to
          become a member.
        </p>
        <Button
          disabled={isPending}
          onClick={() =>
            accept(
              { token },
              {
                onSuccess: () => {
                  toast.add({
                    title: "Invitation accepted",
                    description: "Welcome to the organization",
                    type: "success",
                  });
                  router.push("/organizations");
                },
                onError: (err) => {
                  toast.add({
                    title: "Failed to accept invitation",
                    description:
                      err.message || "Invalid or expired invitation token",
                    type: "error",
                  });
                },
              },
            )
          }
        >
          {isPending ? (
            <>
              <Spinner /> accepting
            </>
          ) : (
            "Accept Invitation"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

export default function AcceptInvitationForm() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center">
          <Spinner />
        </div>
      }
    >
      <AcceptInvitationFormContent />
    </Suspense>
  );
}
