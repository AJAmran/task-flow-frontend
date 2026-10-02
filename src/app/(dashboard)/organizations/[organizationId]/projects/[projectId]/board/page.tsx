import { redirect } from "next/navigation";

export default async function ProjectBoardPage({
  params,
}: {
  params: Promise<{ organizationId: string; projectId: string }>;
}) {
  const { organizationId, projectId } = await params;
  redirect(
    `/organizations/${organizationId}/projects/${projectId}/tasks?view=board`,
  );
}
