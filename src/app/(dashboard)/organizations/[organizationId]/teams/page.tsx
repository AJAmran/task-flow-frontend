import type { Metadata } from "next";
import { Suspense } from "react";
import TeamSection from "@/components/modules/organization/team-section";
import TeamSectionLoading from "@/components/modules/organization/team-section-loading";

export const metadata: Metadata = {
  title: "Teams — TaskFlow",
  description:
    "Create teams, group organization members and staff projects together.",
};

export default async function OrganizationTeamsPage({
  params,
}: {
  params: Promise<{ organizationId: string }>;
}) {
  const { organizationId } = await params;

  return (
    <Suspense fallback={<TeamSectionLoading />}>
      <TeamSection organizationId={organizationId} />
    </Suspense>
  );
}
