import { redirect } from "next/navigation";

export default async function OrganizationTeamsPage({
  params,
}: {
  params: Promise<{ organizationId: string }>;
}) {
  const { organizationId } = await params;
  redirect(`/organizations/${organizationId}/people`);
}
