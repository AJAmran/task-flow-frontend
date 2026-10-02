import { redirect } from "next/navigation";

export default async function ProjectCalendarPage({
  params,
}: {
  params: Promise<{ organizationId: string; projectId: string }>;
}) {
  const { organizationId, projectId } = await params;
  redirect(
    `/organizations/${organizationId}/projects/${projectId}/tasks?view=calendar`,
  );
}
