import type { Metadata } from "next";
import { Suspense } from "react";
import MemberTableLoading from "@/components/modules/organization/member-table-loading";
import MembersSection from "@/components/modules/organization/members-section";
import TeamSection from "@/components/modules/organization/team-section";
import TeamSectionLoading from "@/components/modules/organization/team-section-loading";

export const metadata: Metadata = {
  title: "People — TaskFlow",
  description:
    "Everyone in this workspace. Invite members, change roles, and group people into teams.",
};

export default async function OrganizationPeoplePage({
  params,
}: {
  params: Promise<{ organizationId: string }>;
}) {
  const { organizationId } = await params;

  return (
    <div className="flex flex-1 flex-col gap-8">
      <Suspense fallback={<MemberTableLoading />}>
        <MembersSection organizationId={organizationId} />
      </Suspense>

      <div className="border-t pt-6">
        <Suspense fallback={<TeamSectionLoading />}>
          <TeamSection organizationId={organizationId} />
        </Suspense>
      </div>
    </div>
  );
}
