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
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold tracking-tight">Members</h2>
          <p className="text-sm text-muted-foreground">
            People in this workspace. Owners can invite, change roles, and
            remove members.
          </p>
        </div>
        <Suspense fallback={<MemberTableLoading />}>
          <MembersSection organizationId={organizationId} />
        </Suspense>
      </div>

      <div className="flex flex-col gap-4 border-t pt-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold tracking-tight">Teams</h2>
          <p className="text-sm text-muted-foreground">
            Group members into teams to staff projects together.
          </p>
        </div>
        <Suspense fallback={<TeamSectionLoading />}>
          <TeamSection organizationId={organizationId} />
        </Suspense>
      </div>
    </div>
  );
}
