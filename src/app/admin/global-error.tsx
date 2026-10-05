"use client";

import { TriangleAlert } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-svh flex-col items-center justify-center gap-4 p-6 text-center">
        <span className="flex size-16 items-center justify-center rounded-2xl bg-red-100">
          <TriangleAlert className="size-8 text-red-600" />
        </span>
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">
            Something went wrong
          </h1>
          <p className="max-w-sm text-sm text-muted-foreground">
            {error.message || "An unexpected error stopped this page."} Try
            again, or head back home.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => reset()}>Try again</Button>
          <Button variant="outline" render={<Link href="/">Go home</Link>}>
            Go home
          </Button>
        </div>
      </body>
    </html>
  );
}
