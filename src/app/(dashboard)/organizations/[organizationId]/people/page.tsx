import type { Metadata } from "next";
import { Suspense } from "react";
import PlanUsage from "@/components/modules/billing/plan-usage";
import MemberTableLoading from "@/components/modules/organization/member-table-loading";
import MembersSection from "@/components/modules/organization/members-section";
import TeamSection from "@/components/modules/organization/team-section";
import TeamSectionLoading from "@/components/modules/organization/team-section-loading";
import { Skeleton } from "@/components/ui/skeleton";

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
      <Suspense fallback={<Skeleton className="h-12 w-full" />}>
        <PlanUsage organizationId={organizationId} type="members" />
      </Suspense>
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
