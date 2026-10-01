import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-6 text-center">
      <span className="flex size-16 items-center justify-center rounded-2xl bg-teal-600/10 text-teal-700">
        <FileQuestion className="size-8" />
      </span>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-muted-foreground">Error 404</p>
        <h1 className="text-2xl font-bold tracking-tight">
          This page wandered off
        </h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          The link may be broken, or the page was moved or deleted.
        </p>
      </div>
      <div className="flex gap-2">
        <Button render={<Link href="/">Go home</Link>}>Go home</Button>
        <Button
          variant="outline"
          render={<Link href="/dashboard">Dashboard</Link>}
        >
          Dashboard
        </Button>
      </div>
    </div>
  );
}
