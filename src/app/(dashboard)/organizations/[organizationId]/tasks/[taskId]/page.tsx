import type { Metadata } from "next";
import { Suspense } from "react";
import OrgTaskDetail, {
  OrgTaskDetailFallback,
} from "@/components/modules/task/org-task-detail";

export const metadata: Metadata = {
  title: "Task — TaskFlow",
  description: "Task details with subtasks, discussion, and attachments.",
};

export default async function OrganizationTaskDetailPage({
  params,
}: {
  params: Promise<{ organizationId: string; taskId: string }>;
}) {
  const { organizationId, taskId } = await params;

  return (
    <Suspense fallback={<OrgTaskDetailFallback />}>
      <OrgTaskDetail organizationId={organizationId} taskId={taskId} />
    </Suspense>
  );
}
