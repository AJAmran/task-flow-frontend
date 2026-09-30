import type { Metadata } from "next";
import { Suspense } from "react";
import GlobalActivity, {
  GlobalActivitySkeleton,
} from "@/components/modules/profile/global-activity";

export const metadata: Metadata = {
  title: "My Activity — TaskFlow",
  description:
    "Everything assigned to you across all workspaces, most recent first.",
};

export default function ActivityPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">My activity</h1>
        <p className="text-sm text-muted-foreground">
          Your assigned tasks across every workspace, most recent first.
        </p>
      </div>
      <Suspense fallback={<GlobalActivitySkeleton />}>
        <GlobalActivity />
      </Suspense>
    </div>
  );
}
