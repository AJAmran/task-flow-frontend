import type { Metadata } from "next";
import { Suspense } from "react";
import PlanUsage from "@/components/modules/billing/plan-usage";
import NewProjectButton from "@/components/modules/project/new-project-button";
import ProjectList from "@/components/modules/project/project-list";
import ProjectListLoading from "@/components/modules/project/project-list-loading";
import { Skeleton } from "@/components/ui/skeleton";

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
        <NewProjectButton organizationId={organizationId} />
      </div>
      <Suspense
        fallback={<Skeleton className="h-12 w-full" />}
      >
        <PlanUsage organizationId={organizationId} type="projects" />
      </Suspense>
      <Suspense fallback={<ProjectListLoading />}>
        <ProjectList organizationId={organizationId} />
      </Suspense>
    </div>
  );
}
