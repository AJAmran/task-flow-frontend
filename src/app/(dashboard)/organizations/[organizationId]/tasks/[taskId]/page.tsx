import { ClipboardList } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Task Detail — TaskFlow",
  description: "Task detail with subtasks, comments and attachments.",
};

export default async function OrganizationTaskDetailPage({
  params,
}: {
  params: Promise<{ organizationId: string; taskId: string }>;
}) {
  const { organizationId } = await params;

  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border px-6 py-16 text-center">
      <span className="rounded-full bg-muted p-4">
        <ClipboardList className="size-6 text-muted-foreground" />
      </span>
      <h2 className="text-lg font-semibold tracking-tight">
        Task detail lives in its project
      </h2>
      <p className="max-w-md text-sm text-muted-foreground">
        Open the project that owns this task to see subtasks, comments,
        attachments and activity.
      </p>
      <div className="mt-2">
        <Button
          variant="outline"
          nativeButton={false}
          render={
            <Link href={`/organizations/${organizationId}/tasks`}>
              Back to tasks
            </Link>
          }
        >
          Back to tasks
        </Button>
      </div>
    </div>
  );
}
