"use client";

import { format } from "date-fns";
import { CalendarRange, Pencil, Play, Plus, SearchX } from "lucide-react";
import { useState } from "react";
import CreateSprintForm from "@/components/form/create-sprint-form";
import { Badge } from "@/components/ui/badge";
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
import { Input } from "@/components/ui/input";
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
  useActivateSprint,
  useCompleteSprint,
  useOrganization,
  useSprints,
  useUpdateSprint,
} from "@/hooks";
import type { Sprint, SprintStatus } from "@/types";
import { cn } from "@/lib/utils";
import SprintListLoading from "./sprint-list-loading";

const statusStyles: Record<SprintStatus, string> = {
  PLANNED: "bg-muted text-muted-foreground",
  ACTIVE: "bg-cyan-100 text-cyan-900",
  COMPLETED: "bg-emerald-100 text-emerald-900",
};

function EditSprintDialog({
  organizationId,
  projectId,
  sprint,
  open,
  onOpenChange,
}: {
  organizationId: string;
  projectId: string;
  sprint: Sprint;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [name, setName] = useState(sprint.name);
  const { mutate: update, isPending } = useUpdateSprint(
    organizationId,
    projectId,
    sprint.id,
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit sprint</DialogTitle>
          <DialogDescription>
            Rename this sprint. Dates are fixed after creation.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-label="Sprint name"
            autoComplete="off"
          />
          <Button
            disabled={isPending || name.trim().length < 2}
            onClick={() =>
              update(
                { name: name.trim() },
                {
                  onSuccess: () => {
                    toast.add({
                      title: "Sprint renamed",
                      type: "success",
                      description: `Sprint is now called "${name.trim()}".`,
                    });
                    onOpenChange(false);
                  },
                  onError: (err) => {
                    toast.add({
                      title: "Rename failed",
                      description: err.message || "Please try again",
                      type: "error",
                    });
                  },
                },
              )
            }
          >
            {isPending ? (
              <>
                <Spinner /> Saving...
              </>
            ) : (
              "Save changes"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SprintCard({
  organizationId,
  projectId,
  sprint,
  isOwner,
}: {
  organizationId: string;
  projectId: string;
  sprint: Sprint;
  isOwner: boolean;
}) {
  const [editOpen, setEditOpen] = useState(false);
  const { mutate: activate, isPending: activating } = useActivateSprint(
    organizationId,
    projectId,
  );
  const { mutate: complete, isPending: completing } = useCompleteSprint(
    organizationId,
    projectId,
  );

  const failed = (err: Error) =>
    toast.add({
      title: "Action failed",
      description: err.message || "Please try again",
      type: "error",
    });

  const handleActivate = () => {
    activate(sprint.id, {
      onSuccess: () =>
        toast.add({
          title: "Sprint activated",
          description: `${sprint.name} is now active.`,
          type: "success",
        }),
      onError: failed,
    });
  };

  const handleComplete = () => {
    complete(sprint.id, {
      onSuccess: () =>
        toast.add({
          title: "Sprint completed",
          description: `${sprint.name} is done.`,
          type: "success",
        }),
      onError: failed,
    });
  };

  return (
    <Card
      className={cn(
        "flex flex-col border-t-2 transition-all hover:-translate-y-0.5 hover:shadow-md",
        sprint.status === "ACTIVE"
          ? "border-t-cyan-500"
          : sprint.status === "COMPLETED"
            ? "border-t-emerald-500"
            : "border-t-muted-foreground/20",
      )}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <span className="flex size-10 items-center justify-center rounded-lg bg-teal-600/10 text-teal-700">
            <CalendarRange className="size-5" />
          </span>
          <Badge className={cn(statusStyles[sprint.status])}>
            {sprint.status.toLowerCase()}
          </Badge>
        </div>
        <CardTitle className="line-clamp-1">{sprint.name}</CardTitle>
        <CardDescription>
          {format(new Date(sprint.startDate), "MMM d")} →{" "}
          {format(new Date(sprint.endDate), "MMM d, yyyy")}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        {sprint._count?.tasks ?? 0} task
        {(sprint._count?.tasks ?? 0) === 1 ? "" : "s"}
      </CardContent>
      <CardFooter className="mt-auto flex flex-wrap gap-2">
        {isOwner && sprint.status === "PLANNED" && (
          <Button
            size="sm"
            variant="outline"
            disabled={activating}
            onClick={handleActivate}
          >
            {activating ? <Spinner /> : <Play />} Start
          </Button>
        )}
        {isOwner && sprint.status === "ACTIVE" && (
          <Button
            size="sm"
            variant="outline"
            disabled={completing}
            onClick={handleComplete}
          >
            {completing ? <Spinner /> : "Complete"}
          </Button>
        )}
        <Button size="sm" variant="ghost" onClick={() => setEditOpen(true)}>
          <Pencil /> Rename
        </Button>
      </CardFooter>
      <EditSprintDialog
        organizationId={organizationId}
        projectId={projectId}
        sprint={sprint}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </Card>
  );
}

export default function SprintList({
  organizationId,
  projectId,
}: {
  organizationId: string;
  projectId: string;
}) {
  const [createOpen, setCreateOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"ALL" | SprintStatus>("ALL");
  const [searchInput, setSearchInput] = useState("");

  const { data, isPending, isError, refetch } = useSprints(
    organizationId,
    projectId,
    {
      page: 1,
      limit: 100,
      ...(statusFilter !== "ALL" && { status: statusFilter }),
    },
  );
  const { data: orgData } = useOrganization(organizationId);

  const sprints = (data?.data ?? []).filter((s) =>
    searchInput.trim()
      ? s.name.toLowerCase().includes(searchInput.trim().toLowerCase())
      : true,
  );
  const isOwner = orgData?.data?.myRole === "ORG_OWNER";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Input
            type="search"
            placeholder="Filter by name..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="sm:max-w-52"
            aria-label="Filter sprints by name"
          />
          <Select
            value={statusFilter}
            onValueChange={(val: string | null) =>
              setStatusFilter((val ?? "ALL") as "ALL" | SprintStatus)
            }
          >
            <SelectTrigger className="w-36" aria-label="Filter by status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All status</SelectItem>
              <SelectItem value="PLANNED">Planned</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          <Plus /> New sprint
        </Button>
      </div>

      {isPending ? (
        <SprintListLoading />
      ) : isError ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border p-10 text-center">
          <p className="font-medium">Could not load sprints</p>
          <Button variant="outline" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : sprints.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed px-6 py-12 text-center">
          <span className="rounded-full bg-muted p-3">
            <SearchX className="size-5 text-muted-foreground" />
          </span>
          <p className="font-medium">No sprints yet</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Time-box your work into sprints with a start and end date.
          </p>
          <Button
            className="mt-2"
            size="sm"
            onClick={() => setCreateOpen(true)}
          >
            <Plus /> Create sprint
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sprints.map((sprint) => (
            <SprintCard
              key={sprint.id}
              organizationId={organizationId}
              projectId={projectId}
              sprint={sprint}
              isOwner={isOwner}
            />
          ))}
        </div>
      )}

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a sprint</DialogTitle>
            <DialogDescription>
              Sprints group tasks into a fixed time window.
            </DialogDescription>
          </DialogHeader>
          <CreateSprintForm
            organizationId={organizationId}
            projectId={projectId}
            onSuccess={() => setCreateOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function SprintListSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-hidden>
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-48" />
      ))}
    </div>
  );
}
