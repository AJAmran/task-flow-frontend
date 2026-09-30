import type { Metadata } from "next";
import { Suspense } from "react";
import MemberTableLoading from "@/components/modules/organization/member-table-loading";
import MembersSection from "@/components/modules/organization/members-section";

export const metadata: Metadata = {
  title: "Members — TaskFlow",
  description:
    "See organization members, change roles, remove people, and invite new teammates by email.",
};

export default async function OrganizationMembersPage({
  params,
}: {
  params: Promise<{ organizationId: string }>;
}) {
  const { organizationId } = await params;

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold tracking-tight">Members</h2>
        <p className="text-sm text-muted-foreground">
          People in this organization. Owners can invite, change roles, and
          remove members.
        </p>
      </div>
      <Suspense fallback={<MemberTableLoading />}>
        <MembersSection organizationId={organizationId} />
      </Suspense>
    </div>
  );
}
