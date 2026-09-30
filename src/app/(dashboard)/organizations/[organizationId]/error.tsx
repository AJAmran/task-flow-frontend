"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function OrganizationDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
      <h1 className="text-xl font-bold tracking-tight">
        Organization failed to load
      </h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        {error.message || "You may not be a member of this organization."}
      </p>
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => reset()}>
          Try again
        </Button>
        <Button
          variant="ghost"
          nativeButton={false}
          render={<Link href="/organizations">Back to organizations</Link>}
        >
          Back to organizations
        </Button>
      </div>
    </div>
  );
}
