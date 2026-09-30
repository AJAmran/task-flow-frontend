import type { Metadata } from "next";
import { Suspense } from "react";
import ActivityFeed from "@/components/modules/task/activity-feed";
import ActivityFeedLoading from "@/components/modules/task/activity-feed-loading";

export const metadata: Metadata = {
  title: "Activity — TaskFlow",
  description:
    "Latest project updates. See recently changed tasks, owners, and sprints in one feed.",
};

export default async function ProjectActivityPage({
  params,
}: {
  params: Promise<{ organizationId: string; projectId: string }>;
}) {
  const { organizationId, projectId } = await params;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold tracking-tight">
          Recent updates
        </h2>
        <p className="text-sm text-muted-foreground">
          The most recently changed tasks in this project.
        </p>
      </div>
      <Suspense fallback={<ActivityFeedLoading />}>
        <ActivityFeed organizationId={organizationId} projectId={projectId} />
      </Suspense>
    </div>
  );
}
