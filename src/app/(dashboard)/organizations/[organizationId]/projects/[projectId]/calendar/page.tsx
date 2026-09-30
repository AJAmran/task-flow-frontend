import type { Metadata } from "next";
import { Suspense } from "react";
import TaskCalendar from "@/components/modules/task/task-calendar";
import TaskCalendarLoading from "@/components/modules/task/task-calendar-loading";

export const metadata: Metadata = {
  title: "Calendar — TaskFlow",
  description:
    "Task deadlines on a monthly calendar. Navigate months and open tasks from any day.",
};

export default async function ProjectCalendarPage({
  params,
}: {
  params: Promise<{ organizationId: string; projectId: string }>;
}) {
  const { organizationId, projectId } = await params;

  return (
    <Suspense fallback={<TaskCalendarLoading />}>
      <TaskCalendar organizationId={organizationId} projectId={projectId} />
    </Suspense>
  );
}
