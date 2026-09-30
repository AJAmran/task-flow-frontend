"use client";

import { AlertTriangle, BarChart3 } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
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

const TEAL_SCALE = [
  "#0d9488",
  "#14b8a6",
  "#2dd4bf",
  "#5eead4",
  "#99f6e4",
  "#0f766e",
];

const pretty = (status: string) =>
  status
    .split("_")
    .map((w) => w[0] + w.slice(1).toLowerCase())
    .join(" ");

export function OrgAnalyticsSkeleton() {
  return (
    <div className="grid gap-4 lg:grid-cols-2" aria-label="Loading analytics">
      <Skeleton className="h-72" />
      <Skeleton className="h-72" />
    </div>
  );
}

export default function OrgAnalytics({
  organizationId,
}: {
  organizationId: string;
}) {
  const { data, isPending, isError, refetch } =
    useOrgDashboard(organizationId);

  if (isPending) {
    return <OrgAnalyticsSkeleton />;
  }

  if (isError || !data?.data) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border p-10 text-center">
        <p className="font-medium">Could not load analytics</p>
        <Button variant="outline" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  const dashboard = data.data;
  const tasksByStatus = dashboard.tasksByStatus.map((s) => ({
    name: pretty(s.status),
    value: s.count,
  }));
  const sprintsByStatus = dashboard.sprintsByStatus.map((s) => ({
    name: pretty(s.status),
    value: s.count,
  }));
  const totalTasks = dashboard.counts.tasks;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <BarChart3 className="size-5 text-teal-700" />
        <h2 className="text-lg font-semibold tracking-tight">Analytics</h2>
      </div>

      {dashboard.overdueTasks > 0 && (
        <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm">
          <AlertTriangle className="size-4 shrink-0 text-amber-600" />
          <p>
            <span className="font-semibold">{dashboard.overdueTasks}</span>{" "}
            overdue task{dashboard.overdueTasks === 1 ? "" : "s"} need
            attention.
          </p>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tasks by status</CardTitle>
            <CardDescription>
              {totalTasks} task{totalTasks === 1 ? "" : "s"} across all
              projects.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {tasksByStatus.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No tasks yet.
              </p>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={tasksByStatus}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                    >
                      {tasksByStatus.map((entry, i) => (
                        <Cell
                          key={entry.name}
                          fill={TEAL_SCALE[i % TEAL_SCALE.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Sprints by status</CardTitle>
            <CardDescription>
              {dashboard.counts.sprints} sprint
              {dashboard.counts.sprints === 1 ? "" : "s"} across all projects.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sprintsByStatus.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No sprints yet.
              </p>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sprintsByStatus}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar
                      dataKey="value"
                      name="Sprints"
                      fill="#0d9488"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
