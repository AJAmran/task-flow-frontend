"use client";

import { format } from "date-fns";
import { SearchX, Trash2, UserPlus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import InviteMemberForm from "@/components/form/invite-member-form";
import AvatarInitials from "@/components/ui/avatar-initials";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TablePagination from "@/components/ui/table-pagination";
import { toast } from "@/components/ui/toast";
import {
  useOrganization,
  useOrganizationMembers,
  useRemoveMember,
  useUpdateMemberRole,
} from "@/hooks";
import type { OrgRole } from "@/types";
import MemberTableLoading from "./member-table-loading";

const PAGE_SIZE = 10;

export default function MemberTable({
  organizationId,
  myRole,
  currentUserId,
}: {
  organizationId: string;
  myRole: OrgRole;
  currentUserId?: string;
}) {
  const [page, setPage] = useState(1);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null);

  const isOwner = myRole === "ORG_OWNER";

  const { data, isPending, isError, refetch } = useOrganizationMembers(
    organizationId,
    { page, limit: PAGE_SIZE },
  );
  const { data: orgData } = useOrganization(organizationId);

  const { mutate: changeRole, isPending: rolePending } =
    useUpdateMemberRole(organizationId);
  const { mutate: remove, isPending: removePending } =
    useRemoveMember(organizationId);

  const members = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 0;
  const totalMembers = data?.meta?.total ?? 0;
  const maxMembers =
    orgData?.data?.organization.subscription?.maxMembers;
  const memberLimitReached =
    maxMembers !== undefined && totalMembers >= maxMembers;

  const handleRoleChange = (userId: string, next: OrgRole) => {
    changeRole(
      { userId, payload: { role: next } },
      {
        onSuccess: () => {
          toast.add({
            title: "Role updated",
            description: `Member is now ${next === "ORG_OWNER" ? "an owner" : "a member"}.`,
            type: "success",
          });
        },
        onError: (err) => {
          toast.add({
            title: "Role change failed",
            description:
              err.message || "Something went wrong. Please try again",
            type: "error",
          });
        },
      },
    );
  };

  const handleRemove = (userId: string) => {
    remove(userId, {
      onSuccess: () => {
        toast.add({
          title: "Member removed",
          description: "They no longer have access to this organization.",
          type: "success",
        });
        setConfirmRemoveId(null);
      },
      onError: (err) => {
        toast.add({
          title: "Remove failed",
          description: err.message || "Something went wrong. Please try again",
          type: "error",
        });
      },
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold tracking-tight">Members</h2>
          <p className="text-sm text-muted-foreground">
            {data?.meta?.total ?? 0} member
            {(data?.meta?.total ?? 0) === 1 ? "" : "s"} in this organization
          </p>
        </div>
        {isOwner &&
          (memberLimitReached ? (
            <Button
              size="sm"
              render={<Link href="/dashboard/payments">Upgrade for more</Link>}
            >
              Upgrade for more
            </Button>
          ) : (
            <Button size="sm" onClick={() => setInviteOpen(true)}>
              <UserPlus /> Invite
            </Button>
          ))}
      </div>

      {isPending ? (
        <MemberTableLoading />
      ) : isError ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border p-10 text-center">
          <p className="font-medium">Could not load members</p>
          <Button variant="outline" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Member</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="hidden sm:table-cell">Joined</TableHead>
                  {isOwner && (
                    <TableHead className="text-right">Action</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.length === 0 ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={isOwner ? 4 : 3}>
                      <div className="flex flex-col items-center justify-center gap-2 px-6 py-12 text-center">
                        <span className="rounded-full bg-muted p-3">
                          <SearchX className="size-5 text-muted-foreground" />
                        </span>
                        <p className="font-medium">No members found</p>
                        <p className="max-w-sm text-sm text-muted-foreground">
                          Invite teammates to start collaborating.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  members.map((member) => {
                    const memberIsOwner = member.role === "ORG_OWNER";
                    const isSelf = member.userId === currentUserId;

                    return (
                      <TableRow key={member.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <AvatarInitials name={member.user.name} />
                            <span className="min-w-0">
                              <span className="block truncate text-sm font-medium">
                                {member.user.name}
                                {isSelf && (
                                  <span className="ml-1 text-xs font-normal text-muted-foreground">
                                    (you)
                                  </span>
                                )}
                              </span>
                              <span className="block truncate text-xs text-muted-foreground">
                                {member.user.email}
                              </span>
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={memberIsOwner ? "default" : "secondary"}
                          >
                            {memberIsOwner ? "Owner" : "Member"}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden text-muted-foreground sm:table-cell">
                          {member.joinedAt
                            ? format(new Date(member.joinedAt), "MMM d, yyyy")
                            : "—"}
                        </TableCell>
                        {isOwner && (
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1.5">
                              {!isSelf && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  disabled={rolePending}
                                  onClick={() =>
                                    handleRoleChange(
                                      member.userId,
                                      memberIsOwner ? "MEMBER" : "ORG_OWNER",
                                    )
                                  }
                                  title={
                                    memberIsOwner
                                      ? "Demote to member"
                                      : "Promote to owner"
                                  }
                                >
                                  {rolePending ? (
                                    <Spinner />
                                  ) : memberIsOwner ? (
                                    "Demote"
                                  ) : (
                                    "Make owner"
                                  )}
                                </Button>
                              )}
                              {!isSelf &&
                                (confirmRemoveId === member.userId ? (
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    disabled={removePending}
                                    onClick={() => handleRemove(member.userId)}
                                  >
                                    {removePending ? <Spinner /> : "Confirm"}
                                  </Button>
                                ) : (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      setConfirmRemoveId(member.userId)
                                    }
                                    aria-label={`Remove ${member.user.name}`}
                                  >
                                    <Trash2 />
                                  </Button>
                                ))}
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
          {totalPages > 1 && (
            <TablePagination
              page={page}
              totalPages={totalPages}
              handlePageChange={setPage}
            />
          )}
        </>
      )}

      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite a member</DialogTitle>
            <DialogDescription>
              They will receive an email with an accept link valid for 7 days.
            </DialogDescription>
          </DialogHeader>
          <InviteMemberForm
            organizationId={organizationId}
            onSuccess={() => setInviteOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
