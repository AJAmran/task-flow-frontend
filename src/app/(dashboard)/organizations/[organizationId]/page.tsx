import type { Metadata } from "next";
import { Suspense } from "react";
import OrganizationOverview, {
  OrganizationOverviewSkeleton,
} from "@/components/modules/organization/organization-overview";

export const metadata: Metadata = {
  title: "Organization Overview — TaskFlow",
  description:
    "Organization stats, role, plan and quick links to teams, tasks and projects.",
};

export default async function OrganizationDetailPage({
  params,
}: {
  params: Promise<{ organizationId: string }>;
}) {
  const { organizationId } = await params;

  return (
    <Suspense fallback={<OrganizationOverviewSkeleton />}>
      <OrganizationOverview organizationId={organizationId} />
    </Suspense>
  );
}
