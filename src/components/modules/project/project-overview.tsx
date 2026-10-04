"use client";

import { format } from "date-fns";
import { Archive, CalendarDays, Pencil, Trash2, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import UpdateProjectForm from "@/components/form/update-project-form";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import {
  useDeleteProject,
  useOrganization,
  useProject,
  useUpdateProject,
} from "@/hooks";
import { formatDayUTC, isPastDayUTC } from "@/lib/date";

export function ProjectOverviewSkeleton() {
  return (
    <div className="flex flex-col gap-4" aria-busy="true">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-20 w-full" />
      <div className="grid gap-4 sm:grid-cols-3">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>
    </div>
  );
}

export default function ProjectOverview({
  organizationId,
  projectId,
}: {
  organizationId: string;
  projectId: string;
}) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { data, isPending, isError, refetch } = useProject(
    organizationId,
    projectId,
  );
  const { data: orgData } = useOrganization(organizationId);
  const { mutate: updateStatus, isPending: statusPending } = useUpdateProject(
    organizationId,
    projectId,
  );
  const { mutate: remove, isPending: deletePending } =
    useDeleteProject(organizationId);

  const project = data?.data;
  const isOwner = orgData?.data?.myRole === "ORG_OWNER";

  if (isPending) {
    return <ProjectOverviewSkeleton />;
  }

  if (isError || !project) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border p-10 text-center">
        <p className="font-medium">Could not load project</p>
        <Button variant="outline" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  const archived = project.status === "ARCHIVED";

  const scheduleLabel = (() => {
    if (!project.startDate && !project.endDate) {
      return null;
    }
    return (
      <>
        {formatDayUTC(project.startDate)} → {formatDayUTC(project.endDate)}
        {isPastDayUTC(project.endDate) && (
          <span className="ml-1 text-destructive">(past)</span>
        )}
      </>
    );
  })();

  const handleStatusToggle = () => {
    updateStatus(
      { status: archived ? "ACTIVE" : "ARCHIVED" },
      {
        onSuccess: () => {
          toast.add({
            title: archived ? "Project restored" : "Project archived",
            description: archived
              ? `${project.name} is active again.`
              : `${project.name} is now archived.`,
            type: "success",
          });
        },
        onError: (err) => {
          toast.add({
            title: "Update failed",
            description: err.message || "Please try again",
            type: "error",
          });
        },
      },
    );
  };

  const handleDelete = () => {
    remove(project.id, {
      onSuccess: () => {
        toast.add({
          title: "Project deleted",
          description: `${project.name} was removed.`,
          type: "success",
        });
        router.push(`/organizations/${organizationId}/projects`);
      },
      onError: (err) => {
        toast.add({
          title: "Delete failed",
          description: err.message || "Only organization owners can delete.",
          type: "error",
        });
      },
    });
  };

  const stats = [
    { label: "Tasks", value: project._count?.tasks ?? 0 },
    { label: "Sprints", value: project._count?.sprints ?? 0 },
    { label: "Members", value: project.members.length },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={archived ? "secondary" : "default"}>
              {archived ? (
                <>
                  <Archive className="size-3" /> Archived
                </>
              ) : (
                "Active"
              )}
            </Badge>
            {project.team && (
              <Badge variant="outline">{project.team.name}</Badge>
            )}
          </div>
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <CalendarDays className="size-3" />
            {scheduleLabel ?? (
              <>Created {format(new Date(project.createdAt), "MMM d, yyyy")}</>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
            <Pencil /> Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={statusPending}
            onClick={handleStatusToggle}
          >
            {statusPending ? <Spinner /> : <Archive />}
            {archived ? "Restore" : "Archive"}
          </Button>
          {isOwner &&
            (confirmDelete ? (
              <>
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
              </>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setConfirmDelete(true)}
                aria-label={`Delete ${project.name}`}
              >
                <Trash2 />
              </Button>
            ))}
        </div>
      </div>

      {project.description && (
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm whitespace-pre-wrap">{project.description}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader>
              <CardDescription>{stat.label}</CardDescription>
              <CardTitle className="text-2xl">{stat.value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="size-4" /> Quick note
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            Manage tasks on the Board and List tabs, plan time-boxed work under
            Sprints, and review every change in Activity. Manage project members
            below.
          </CardDescription>
        </CardContent>
      </Card>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit project</DialogTitle>
            <DialogDescription>
              Update name, description, status, or team.
            </DialogDescription>
          </DialogHeader>
          <UpdateProjectForm
            organizationId={organizationId}
            project={project}
            onSuccess={() => setEditOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
