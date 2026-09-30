"use client";

import { useGetMe, useOrganization } from "@/hooks";
import MemberTable from "./member-table";
import MemberTableLoading from "./member-table-loading";

export default function MembersSection({
  organizationId,
}: {
  organizationId: string;
}) {
  const { data: orgData, isPending: orgPending } =
    useOrganization(organizationId);
  const { data: meData } = useGetMe();

  if (orgPending) {
    return <MemberTableLoading />;
  }

  const myRole = orgData?.data?.myRole ?? "MEMBER";

  return (
    <MemberTable
      organizationId={organizationId}
      myRole={myRole}
      currentUserId={meData?.data?.id}
    />
  );
}
