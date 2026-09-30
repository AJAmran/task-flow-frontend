import type { Metadata } from "next";
import { Suspense } from "react";
import SprintList from "@/components/modules/task/sprint-list";
import SprintListLoading from "@/components/modules/task/sprint-list-loading";

export const metadata: Metadata = {
  title: "Sprints — TaskFlow",
  description:
    "Plan time-boxed sprints. Start, complete, rename, and track task counts per sprint.",
};

export default async function ProjectSprintsPage({
  params,
}: {
  params: Promise<{ organizationId: string; projectId: string }>;
}) {
  const { organizationId, projectId } = await params;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold tracking-tight">Sprints</h2>
        <p className="text-sm text-muted-foreground">
          Time-box work. Only one sprint is usually active at a time.
        </p>
      </div>
      <Suspense fallback={<SprintListLoading />}>
        <SprintList organizationId={organizationId} projectId={projectId} />
      </Suspense>
    </div>
  );
}
