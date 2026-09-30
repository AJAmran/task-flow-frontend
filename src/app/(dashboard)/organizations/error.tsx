"use client";

import { Button } from "@/components/ui/button";

export default function OrganizationsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
      <h1 className="text-xl font-bold tracking-tight">
        Organizations failed to load
      </h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        {error.message ||
          "Something went wrong while fetching your workspaces."}
      </p>
      <Button variant="outline" onClick={() => reset()}>
        Try again
      </Button>
    </div>
  );
}
