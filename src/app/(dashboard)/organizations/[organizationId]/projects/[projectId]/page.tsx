import type { Metadata } from "next";
import { Suspense } from "react";
import ProjectMembers, {
  ProjectMembersSkeleton,
} from "@/components/modules/project/project-members";
import ProjectOverview, {
  ProjectOverviewSkeleton,
} from "@/components/modules/project/project-overview";

export const metadata: Metadata = {
  title: "Project Overview — TaskFlow",
  description:
    "Project details, stats, member management, and quick links to board, sprints, and activity.",
};

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ organizationId: string; projectId: string }>;
}) {
  const { organizationId, projectId } = await params;

  return (
    <div className="flex flex-col gap-4">
      <Suspense fallback={<ProjectOverviewSkeleton />}>
        <ProjectOverview organizationId={organizationId} projectId={projectId} />
      </Suspense>
      <Suspense fallback={<ProjectMembersSkeleton />}>
        <ProjectMembers organizationId={organizationId} projectId={projectId} />
      </Suspense>
    </div>
  );
}
