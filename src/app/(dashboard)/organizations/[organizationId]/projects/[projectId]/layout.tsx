"use client";

import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { use, useState } from "react";
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
import { cn } from "@/lib/utils";

function ProjectNav({
  organizationId,
  projectId,
}: {
  organizationId: string;
  projectId: string;
}) {
  const pathname = usePathname();
  const { data, isPending } = useProject(organizationId, projectId);
  const [createOpen, setCreateOpen] = useState(false);

  const base = `/organizations/${organizationId}/projects/${projectId}`;
  const tabs = [
    { title: "Overview", url: base },
    { title: "Board", url: `${base}/board` },
    { title: "List", url: `${base}/list` },
    { title: "Calendar", url: `${base}/calendar` },
    { title: "Sprints", url: `${base}/sprints` },
    { title: "Activity", url: `${base}/activity` },
  ];

  const project = data?.data;

  return (
    <div className="flex flex-col gap-3 border-b px-6 pt-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-2">
          <Link
            href={`/organizations/${organizationId}/projects`}
            className="flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" /> All projects
          </Link>
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
        </div>
        <Button
          size="sm"
          className="shrink-0"
          onClick={() => setCreateOpen(true)}
        >
          <Plus /> New task
        </Button>
      </div>
      <nav className="flex gap-1 overflow-x-auto" aria-label="Project">
        {tabs.map((tab) => {
          const active =
            tab.url === base
              ? pathname === base
              : pathname === tab.url || pathname.startsWith(`${tab.url}/`);

          return (
            <Link
              key={tab.title}
              href={tab.url}
              aria-current={active ? "page" : undefined}
              className={cn(
                "rounded-t-lg border-b-2 px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors",
                active
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {tab.title}
            </Link>
          );
        })}
      </nav>

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
    <div className="-m-6 flex flex-1 flex-col">
      <ProjectNav organizationId={organizationId} projectId={projectId} />
      <div className="flex flex-1 flex-col gap-4 p-6">{children}</div>
    </div>
  );
}
