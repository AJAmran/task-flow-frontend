import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Suspense } from "react";
import ProjectList from "@/components/modules/project/project-list";
import ProjectListLoading from "@/components/modules/project/project-list-loading";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Projects — TaskFlow",
  description:
    "Browse organization projects. Filter by status or team, sort, and open a project workspace.",
};

export default async function OrganizationProjectsPage({
  params,
}: {
  params: Promise<{ organizationId: string }>;
}) {
  const { organizationId } = await params;

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold tracking-tight">Projects</h2>
          <p className="text-sm text-muted-foreground">
            Workspaces for sprints, tasks, and delivery
          </p>
        </div>
        <Button
          render={
            <Link href={`/organizations/${organizationId}/projects/new`}>
              New project
            </Link>
          }
        >
          <Plus /> New project
        </Button>
      </div>
      <Suspense fallback={<ProjectListLoading />}>
        <ProjectList organizationId={organizationId} />
      </Suspense>
    </div>
  );
}
