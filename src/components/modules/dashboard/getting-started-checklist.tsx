"use client";

import { CheckCircle2, Circle, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrgDashboard } from "@/hooks";
import { cn } from "@/lib/utils";

const DISMISS_KEY = "tf_guide_done";

export function GettingStartedSkeleton() {
  return <Skeleton className="h-44 w-full" aria-label="Loading guide" />;
}

export default function GettingStartedChecklist({
  organizationId,
  organizationName,
}: {
  organizationId: string;
  organizationName: string;
}) {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    try {
      setDismissed(sessionStorage.getItem(DISMISS_KEY) === "1");
    } catch {
      setDismissed(false);
    }
  }, []);

  const { data, isPending } = useOrgDashboard(organizationId);

  if (dismissed) {
    return null;
  }

  const dismiss = () => {
    try {
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // Ignore storage errors.
    }
    setDismissed(true);
  };

  if (isPending) {
    return <GettingStartedSkeleton />;
  }

  const counts = data?.data?.counts;
  const firstProjectId = data?.data?.recentProjects[0]?.id;

  const steps = [
    {
      done: true,
      title: "Workspace created",
      description: `“${organizationName}” is ready.`,
      cta: null as { label: string; href: string } | null,
    },
    {
      done: (counts?.members ?? 0) > 1,
      title: "Invite a teammate",
      description: "Add people by email so work is shared.",
      cta: {
        label: "Invite now",
        href: `/organizations/${organizationId}/members`,
      },
    },
    {
      done: (counts?.projects ?? 0) > 0,
      title: "Start a project",
      description: "A project holds sprints and tasks.",
      cta: {
        label: "View projects",
        href: `/organizations/${organizationId}/projects`,
      },
    },
    {
      done: (counts?.tasks ?? 0) > 0,
      title: "Create a task",
      description: "Break the project into trackable work.",
      cta: firstProjectId
        ? {
            label: "Open board",
            href: `/organizations/${organizationId}/projects/${firstProjectId}/board`,
          }
        : null,
    },
  ];

  const doneCount = steps.filter((s) => s.done).length;
  if (doneCount === steps.length) {
    return null;
  }

  return (
    <Card className="border-teal-600/20 bg-gradient-to-br from-teal-50/60 to-transparent">
      <CardHeader className="flex flex-row items-start justify-between gap-2 pb-2">
        <div>
          <CardTitle className="text-base">
            Getting started ({doneCount}/{steps.length})
          </CardTitle>
          <CardDescription>
            Finish setup — each step takes under a minute.
          </CardDescription>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={dismiss}
          aria-label="Dismiss guide"
        >
          <X />
        </Button>
      </CardHeader>
      <CardContent>
        <div
          className="mb-3 h-1.5 overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-valuenow={doneCount}
          aria-valuemin={0}
          aria-valuemax={steps.length}
        >
          <div
            className="h-full bg-teal-500 transition-all"
            style={{ width: `${(doneCount / steps.length) * 100}%` }}
          />
        </div>
        <ol className="grid gap-2 sm:grid-cols-2">
          {steps.map((step) => (
            <li
              key={step.title}
              className={cn(
                "flex items-center gap-3 rounded-xl border bg-card p-3",
                step.done && "opacity-70",
              )}
            >
              {step.done ? (
                <CheckCircle2 className="size-5 shrink-0 text-teal-600" />
              ) : (
                <Circle className="size-5 shrink-0 text-muted-foreground" />
              )}
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium">{step.title}</span>
                <span className="block truncate text-xs text-muted-foreground">
                  {step.description}
                </span>
              </span>
              {!step.done && step.cta && (
                <Button
                  variant="outline"
                  size="sm"
                  className="shrink-0"
                  render={<Link href={step.cta.href}>{step.cta.label}</Link>}
                >
                  {step.cta.label}
                </Button>
              )}
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
