"use client";

import { Banknote, Building2, Users, Wallet } from "lucide-react";
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
import { useAdminDashboardStats } from "@/hooks";

const TEAL_SCALE = ["#0d9488", "#14b8a6", "#2dd4bf", "#0f766e", "#5eead4"];

const pretty = (value: string) =>
  value
    .split("_")
    .map((w) => w[0] + w.slice(1).toLowerCase())
    .join(" ");

export function AdminOverviewSkeleton() {
  return (
    <div className="flex flex-col gap-4" role="status" aria-label="Loading admin overview">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-72" />
        <Skeleton className="h-72" />
      </div>
    </div>
  );
}

export default function AdminOverview() {
  const { data, isPending, isError, refetch } = useAdminDashboardStats();

  if (isPending) {
    return <AdminOverviewSkeleton />;
  }

  if (isError || !data?.data) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border p-10 text-center">
        <p className="font-medium">Could not load platform stats</p>
        <Button variant="outline" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  const stats = data.data;
  const totals = [
    {
      label: "Organizations",
      value: stats.totals.organizations,
      icon: Building2,
    },
    { label: "Users", value: stats.totals.users, icon: Users },
    {
      label: "Active subscriptions",
      value: stats.totals.activeSubscriptions,
      icon: Wallet,
    },
    {
      label: "Revenue (BDT)",
      value: `৳${stats.totals.revenueBDT.toLocaleString()}`,
      icon: Banknote,
    },
  ];

  const subsByPlan = stats.subscriptionsByPlan.map((s) => ({
    name: s.plan,
    value: s.count,
  }));
  const paymentsByStatus = stats.paymentsByStatus.map((s) => ({
    name: pretty(s.status),
    value: s.count,
  }));
  const usersByRole = stats.usersByRole.map((s) => ({
    name: pretty(s.role),
    value: s.count,
  }));

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {totals.map((total) => {
          const Icon = total.icon;
          return (
            <Card key={total.label}>
              <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {total.label}
                </CardTitle>
                <span className="flex size-8 items-center justify-center rounded-lg bg-teal-600/10 text-teal-700">
                  <Icon className="size-4" />
                </span>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{total.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Subscriptions by plan</CardTitle>
            <CardDescription>Where paying organizations sit.</CardDescription>
          </CardHeader>
          <CardContent>
            {subsByPlan.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No subscriptions yet.
              </p>
            ) : (
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={subsByPlan}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                    >
                      {subsByPlan.map((entry, i) => (
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
            <CardTitle className="text-base">Payments by status</CardTitle>
            <CardDescription>Gateway outcomes across billing.</CardDescription>
          </CardHeader>
          <CardContent>
            {paymentsByStatus.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No payments yet.
              </p>
            ) : (
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={paymentsByStatus}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar
                      dataKey="value"
                      name="Payments"
                      fill="#0d9488"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Users by role</CardTitle>
            <CardDescription>Platform-wide role split.</CardDescription>
          </CardHeader>
          <CardContent>
            {usersByRole.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No users yet.
              </p>
            ) : (
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={usersByRole} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis
                      type="number"
                      allowDecimals={false}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fontSize: 12 }}
                      width={90}
                    />
                    <Tooltip />
                    <Bar
                      dataKey="value"
                      name="Users"
                      fill="#0f766e"
                      radius={[0, 6, 6, 0]}
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
