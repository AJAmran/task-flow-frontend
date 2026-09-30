import { ClipboardList, FolderKanban } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Organization Tasks — TaskFlow",
  description:
    "Tasks across every project in this organization. Plan work inside a project board.",
};

export default async function OrganizationTasksPage({
  params,
}: {
  params: Promise<{ organizationId: string }>;
}) {
  const { organizationId } = await params;

  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border px-6 py-16 text-center">
      <span className="rounded-full bg-muted p-4">
        <ClipboardList className="size-6 text-muted-foreground" />
      </span>
      <h2 className="text-lg font-semibold tracking-tight">
        Tasks live inside projects
      </h2>
      <p className="max-w-md text-sm text-muted-foreground">
        Open a project to plan sprints and track tasks on the Kanban board, list
        or calendar. Cross-project task views arrive with the project workspace.
      </p>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row">
        <Button
          nativeButton={false}
          render={
            <Link href={`/organizations/${organizationId}/projects`}>
              View projects
            </Link>
          }
        >
          <FolderKanban /> View projects
        </Button>
        <Button
          variant="outline"
          nativeButton={false}
          render={
            <Link href={`/organizations/${organizationId}/teams`}>
              Manage teams
            </Link>
          }
        >
          Manage teams
        </Button>
      </div>
    </div>
  );
}
