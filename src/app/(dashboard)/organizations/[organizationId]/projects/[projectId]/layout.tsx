"use client";

import { Plus } from "lucide-react";
import { use, useState } from "react";
import AuthGuard from "@/components/auth/auth-guard";
import TaskCreateWizard from "@/components/form/task-create-wizard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useProject } from "@/hooks";

function ProjectNav({
  organizationId,
  projectId,
}: {
  organizationId: string;
  projectId: string;
}) {
  const { data, isPending } = useProject(organizationId, projectId);
  const [createOpen, setCreateOpen] = useState(false);

  const project = data?.data;

  return (
    <div className="flex flex-col gap-3 border-b px-6 py-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          {isPending ? (
            <Skeleton className="h-7 w-56" />
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight">
                {project?.name ?? "Project"}
              </h2>
              {project && (
                <Badge
                  variant={
                    project.status === "ACTIVE" ? "default" : "secondary"
                  }
                >
                  {project.status === "ACTIVE" ? "Active" : "Archived"}
                </Badge>
              )}
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            Navigate with the sidebar · create tasks from anywhere here.
          </p>
        </div>
        <Button
          size="sm"
          className="shrink-0"
          onClick={() => setCreateOpen(true)}
        >
          <Plus /> New task
        </Button>
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create a task</DialogTitle>
          </DialogHeader>
          <TaskCreateWizard
            organizationId={organizationId}
            projectId={projectId}
            onSuccess={() => setCreateOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ organizationId: string; projectId: string }>;
}) {
  const { organizationId, projectId } = use(params);

  return (
    <AuthGuard>
      <div className="-m-6 flex flex-1 flex-col">
        <ProjectNav organizationId={organizationId} projectId={projectId} />
        <div className="flex flex-1 flex-col gap-4 p-6">{children}</div>
      </div>
    </AuthGuard>
  );
}
