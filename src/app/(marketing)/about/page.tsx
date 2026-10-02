import type { Metadata } from "next";
import { Logo } from "@/assets/logo";
import CtaBand from "@/components/modules/homepage/CtaBand";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About — TaskFlow",
  description:
    "TaskFlow is a project management SaaS built with Next.js — workspaces, sprints, Kanban boards, and role-based dashboards.",
};

const values = [
  {
    step: "01",
    title: "Real workflows first",
    description:
      "Every page mirrors a backend capability: invitations, sprints, task states, payments. No mock screens.",
  },
  {
    step: "02",
    title: "Roles with purpose",
    description:
      "Admins govern the platform, owners run workspaces, members deliver tasks. Each dashboard serves its role.",
  },
  {
    step: "03",
    title: "Performance by default",
    description:
      "Server Components, streaming skeletons, cached queries, and optimized images keep every view fast.",
  },
];

const stack = [
  "Next.js 16",
  "TypeScript",
  "Tailwind CSS",
  "shadcn/ui",
  "TanStack Query",
  "TanStack Form",
  "Zod",
  "bKash billing",
];

const stats = [
  ["3", "Distinct roles"],
  ["18+", "App pages"],
  ["6", "Task views & flows"],
];

export default function AboutPage() {
  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(ellipse_50%_60%_at_50%_0%,rgba(45,212,191,0.12),transparent)]"
      />
      <div className="relative mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-10 flex flex-col items-center gap-4 text-center">
          <Logo size={64} href="" />
          <span className="inline-block rounded-full border border-teal-600/20 bg-teal-50 px-3 py-1 text-xs font-medium text-teal-900">
            Our story
          </span>
          <h1 className="max-w-2xl text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            Project delivery,{" "}
            <span className="bg-gradient-to-r from-teal-600 to-cyan-500 bg-clip-text text-transparent">
              without the chaos
            </span>
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            TaskFlow is a full-stack project management platform: workspaces
            own projects, teams deliver sprints, and members move tasks from
            backlog to done — all behind secure role-based access and real
            subscription billing.
          </p>
        </div>

        <dl className="mx-auto mb-12 grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3">
          {stats.map(([value, label]) => (
            <div
              key={label}
              className="flex flex-col gap-1 rounded-xl border bg-card p-4 text-center shadow-sm"
            >
              <dd className="bg-gradient-to-br from-teal-700 to-teal-500 bg-clip-text text-2xl font-bold text-transparent">
                {value}
              </dd>
              <dt className="text-sm text-muted-foreground">{label}</dt>
            </div>
          ))}
        </dl>

        <div className="grid gap-4 md:grid-cols-3">
          {values.map((value) => (
            <Card
              key={value.title}
              className="transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <CardHeader>
                <span className="bg-gradient-to-br from-teal-700 to-teal-500 bg-clip-text text-sm font-bold text-transparent">
                  {value.step}
                </span>
                <CardTitle>{value.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{value.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <h2 className="mb-4 text-xl font-bold">Built with a modern stack</h2>
          <ul className="flex flex-wrap justify-center gap-2">
            {stack.map((tech) => (
              <li
                key={tech}
                className="rounded-full border border-teal-600/20 bg-teal-50 px-3 py-1 text-xs font-medium text-teal-900"
              >
                {tech}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8">
          <CtaBand
            title="Come build with us"
            description="Start a free workspace and feel the difference on your very first sprint."
            secondaryCta="View pricing"
            secondaryHref="/pricing"
          />
        </div>
      </div>
    </div>
  );
}
