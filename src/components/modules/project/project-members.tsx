"use client";

import { Crown, Trash2, User, UserPlus } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import {
  useAddProjectMember,
  useOrganizationMembers,
  useProject,
  useRemoveProjectMember,
} from "@/hooks";

export function ProjectMembersSkeleton() {
  return (
    <div className="flex flex-col gap-2" aria-label="Loading members">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-14 w-full" />
      ))}
    </div>
  );
}

export default function ProjectMembers({
  organizationId,
  projectId,
}: {
  organizationId: string;
  projectId: string;
}) {
  const [selectedUserId, setSelectedUserId] = useState("");

  const { data, isPending } = useProject(organizationId, projectId);
  const { data: orgMembersData } = useOrganizationMembers(organizationId, {
    page: 1,
    limit: 100,
  });
  const { mutate: addMember, isPending: addPending } = useAddProjectMember(
    organizationId,
    projectId,
  );
  const { mutate: removeMember, isPending: removePending } =
    useRemoveProjectMember(organizationId, projectId);

  const members = data?.data?.members ?? [];
  const memberIds = new Set(members.map((m) => m.userId));
  const candidates = (orgMembersData?.data ?? []).filter(
    (m) => !memberIds.has(m.userId),
  );

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
            description: "They can now collaborate in this project.",
            type: "success",
          });
          setSelectedUserId("");
        },
        onError: (err) => {
          toast.add({
            title: "Add failed",
            description: err.message || "Please try again",
            type: "error",
          });
        },
      },
    );
  };

  const handleRemove = (userId: string) => {
    removeMember(userId, {
      onSuccess: () => {
        toast.add({
          title: "Member removed",
          description: "They remain in the organization.",
          type: "success",
        });
      },
      onError: (err) => {
        toast.add({
          title: "Remove failed",
          description: err.message || "Please try again",
          type: "error",
        });
      },
    });
  };

  if (isPending) {
    return <ProjectMembersSkeleton />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Members ({members.length})</CardTitle>
        <CardDescription>
          Only organization members can join this project.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {members.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No members yet. Add organization members below.
          </p>
        ) : (
          members.map((member) => {
            const isOwner = member.role === "ORG_OWNER";
            return (
              <div
                key={member.id}
                className="flex items-center justify-between gap-2 rounded-lg border px-3 py-2"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
                    {isOwner ? (
                      <Crown className="size-4" />
                    ) : (
                      <User className="size-4" />
                    )}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">
                      {member.user.name}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {member.user.email}
                    </span>
                  </span>
                </span>
                <span className="flex items-center gap-2">
                  <Badge variant={isOwner ? "default" : "secondary"}>
                    {isOwner ? "Owner" : "Member"}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={removePending}
                    onClick={() => handleRemove(member.userId)}
                    aria-label={`Remove ${member.user.name}`}
                  >
                    <Trash2 />
                  </Button>
                </span>
              </div>
            );
          })
        )}

        {candidates.length > 0 && (
          <div className="flex gap-2 pt-2">
            <Select
              value={selectedUserId}
              onValueChange={(val: string | null) =>
                setSelectedUserId(val ?? "")
              }
            >
              <SelectTrigger
                className="min-w-0 flex-1"
                aria-label="Select organization member"
              >
                <SelectValue placeholder="Select member..." />
              </SelectTrigger>
              <SelectContent>
                {candidates.map((candidate) => (
                  <SelectItem key={candidate.userId} value={candidate.userId}>
                    {candidate.user.name} ({candidate.user.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
      </CardContent>
    </Card>
  );
}
