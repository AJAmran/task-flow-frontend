"use client";

import { format } from "date-fns";
import {
  ChevronDown,
  Plus,
  SearchX,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import { useState } from "react";
import CreateTeamForm from "@/components/form/create-team-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import {
  useAddTeamMember,
  useDeleteTeam,
  useOrganizationMembers,
  useRemoveTeamMember,
  useTeamMembers,
  useTeams,
} from "@/hooks";
import { cn } from "@/lib/utils";
import type { OrganizationMember, Team } from "@/types";
import TeamSectionLoading from "./team-section-loading";

function TeamCard({
  organizationId,
  team,
  orgMembers,
  canManage,
}: {
  organizationId: string;
  team: Team;
  orgMembers: OrganizationMember[];
  canManage: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");

  const { data: teamMembersData, isPending: membersPending } = useTeamMembers(
    organizationId,
    team.id,
    { page: 1, limit: 50 },
  );

  const { mutate: removeTeam, isPending: deletePending } =
    useDeleteTeam(organizationId);
  const { mutate: addMember, isPending: addPending } = useAddTeamMember(
    organizationId,
    team.id,
  );
  const { mutate: removeMember, isPending: removePending } =
    useRemoveTeamMember(organizationId, team.id);

  const teamMembers = teamMembersData?.data ?? [];
  const teamUserIds = new Set(teamMembers.map((m) => m.userId));
  const candidates = orgMembers.filter((m) => !teamUserIds.has(m.userId));

  const notifyError = (title: string, message: string) => {
    toast.add({ title, description: message, type: "error" });
  };

  const handleDelete = () => {
    removeTeam(team.id, {
      onSuccess: () => {
        toast.add({
          title: "Team deleted",
          description: `${team.name} was removed.`,
          type: "success",
        });
      },
      onError: (err) => {
        notifyError("Delete failed", err.message || "Please try again");
      },
    });
  };

  const handleAdd = () => {
    if (!selectedUserId) {
      return;
    }
    addMember(
      { userId: selectedUserId },
      {
        onSuccess: () => {
          toast.add({
            title: "Member added",
            description: "They can now collaborate in this team.",
            type: "success",
          });
          setSelectedUserId("");
        },
        onError: (err) => {
          notifyError("Add failed", err.message || "Please try again");
        },
      },
    );
  };

  const handleRemove = (userId: string) => {
    removeMember(userId, {
      onSuccess: () => {
        toast.add({
          title: "Member removed from team",
          type: "success",
          description: "They remain in the organization.",
        });
      },
      onError: (err) => {
        notifyError("Remove failed", err.message || "Please try again");
      },
    });
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <span className="flex size-10 items-center justify-center rounded-lg bg-muted">
            <Users className="size-5" />
          </span>
          {canManage &&
            (confirmDelete ? (
              <div className="flex gap-1.5">
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={deletePending}
                  onClick={handleDelete}
                >
                  {deletePending ? <Spinner /> : "Confirm"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setConfirmDelete(false)}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setConfirmDelete(true)}
                aria-label={`Delete ${team.name}`}
              >
                <Trash2 />
              </Button>
            ))}
        </div>
        <CardTitle className="line-clamp-1">{team.name}</CardTitle>
        <CardDescription>
          Created {format(new Date(team.createdAt), "MMM d, yyyy")}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="flex items-center justify-between text-sm font-medium"
          aria-expanded={expanded}
        >
          <span>
            {teamMembers.length} member{teamMembers.length === 1 ? "" : "s"}
          </span>
          <ChevronDown
            className={cn(
              "size-4 transition-transform",
              expanded && "rotate-180",
            )}
          />
        </button>

        {expanded && (
          <div className="flex flex-col gap-2">
            {membersPending ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Spinner /> Loading members...
              </div>
            ) : teamMembers.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No members in this team yet.
              </p>
            ) : (
              teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between gap-2 rounded-lg border px-3 py-2"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">
                      {member.user?.name ?? member.userId}
                    </span>
                    {member.user?.email && (
                      <span className="block truncate text-xs text-muted-foreground">
                        {member.user.email}
                      </span>
                    )}
                  </span>
                  {canManage && (
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={removePending}
                      onClick={() => handleRemove(member.userId)}
                      aria-label="Remove from team"
                    >
                      <Trash2 />
                    </Button>
                  )}
                </div>
              ))
            )}

            {canManage && candidates.length > 0 && (
              <div className="flex gap-2 pt-1">
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="h-8 min-w-0 flex-1 rounded-lg border border-border bg-background px-2 text-sm"
                  aria-label="Select organization member to add"
                >
                  <option value="">Select member...</option>
                  {candidates.map((candidate) => (
                    <option key={candidate.userId} value={candidate.userId}>
                      {candidate.user.name} ({candidate.user.email})
                    </option>
                  ))}
                </select>
                <Button
                  size="sm"
                  disabled={!selectedUserId || addPending}
                  onClick={handleAdd}
                >
                  {addPending ? <Spinner /> : <UserPlus />}
                  Add
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="mt-auto text-xs text-muted-foreground">
        Members must belong to the organization first.
      </CardFooter>
    </Card>
  );
}

export default function TeamSection({
  organizationId,
}: {
  organizationId: string;
}) {
  const [createOpen, setCreateOpen] = useState(false);

  // Any org member can manage teams (backend enforces membership only).
  const canManage = true;

  const { data, isPending, isError, refetch } = useTeams(organizationId, {
    page: 1,
    limit: 50,
  });
  const { data: orgMembersData } = useOrganizationMembers(organizationId, {
    page: 1,
    limit: 100,
  });

  const teams = data?.data ?? [];
  const orgMembers = orgMembersData?.data ?? [];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold tracking-tight">Teams</h2>
          <p className="text-sm text-muted-foreground">
            {teams.length} team{teams.length === 1 ? "" : "s"} in this
            organization
          </p>
        </div>
        {canManage && (
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <Plus /> New team
          </Button>
        )}
      </div>

      {isPending ? (
        <TeamSectionLoading />
      ) : isError ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border p-10 text-center">
          <p className="font-medium">Could not load teams</p>
          <Button variant="outline" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : teams.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border px-6 py-12 text-center">
          <span className="rounded-full bg-muted p-3">
            <SearchX className="size-5 text-muted-foreground" />
          </span>
          <p className="font-medium">No teams yet</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Group members into teams to organize projects and work.
          </p>
          {canManage && (
            <Button
              className="mt-2"
              size="sm"
              onClick={() => setCreateOpen(true)}
            >
              <Plus /> Create team
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {teams.map((team) => (
            <TeamCard
              key={team.id}
              organizationId={organizationId}
              team={team}
              orgMembers={orgMembers}
              canManage={canManage}
            />
          ))}
        </div>
      )}

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a team</DialogTitle>
            <DialogDescription>
              Teams group organization members so you can staff projects
              together.
            </DialogDescription>
          </DialogHeader>
          <CreateTeamForm
            organizationId={organizationId}
            onSuccess={() => setCreateOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
