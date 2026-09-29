import type { Metadata } from "next";
import { Logo } from "@/assets/logo";
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
    "TaskFlow is a project management SaaS built with Next.js — organizations, sprints, Kanban boards, and role-based dashboards.",
};

const values = [
  {
    title: "Real workflows first",
    description:
      "Every page mirrors a backend capability: invitations, sprints, task states, payments. No mock screens.",
  },
  {
    title: "Roles with purpose",
    description:
      "Admins govern the platform, owners run organizations, members deliver tasks. Each dashboard serves its role.",
  },
  {
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

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-10 flex flex-col items-center gap-4 text-center">
        <Logo size={64} href="" />
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          About TaskFlow
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          TaskFlow is a full-stack project management platform: organizations
          own projects, teams deliver sprints, and members move tasks from
          backlog to done — all behind secure role-based access and real
          subscription billing.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {values.map((value) => (
          <Card key={value.title}>
            <CardHeader>
              <CardTitle>{value.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{value.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12">
        <h2 className="mb-4 text-center text-xl font-bold">
          Built with a modern stack
        </h2>
        <ul className="flex flex-wrap justify-center gap-2">
          {stack.map((tech) => (
            <li
              key={tech}
              className="rounded-full border bg-muted px-3 py-1 text-xs font-medium"
            >
              {tech}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
