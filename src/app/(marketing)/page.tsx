import type { Metadata } from "next";
import CtaBand from "@/components/modules/homepage/CtaBand";
import Hero from "@/components/modules/homepage/Hero";
import { homeFeatures } from "@/components/modules/homepage/home-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "TaskFlow — Project Management for Modern Teams",
  description:
    "Plan sprints, track tasks on Kanban boards, manage teams, and bill subscriptions. One workspace for your whole organization.",
};

const steps = [
  {
    step: "01",
    title: "Create your workspace",
    description:
      "Sign up, verify your email, and create a workspace for your company or client.",
  },
  {
    step: "02",
    title: "Invite your team",
    description:
      "Send email invitations, group people into teams, and add them to projects.",
  },
  {
    step: "03",
    title: "Plan and ship",
    description:
      "Break work into sprints and tasks, track them on the board, and review activity.",
  },
];

export default function HomePage() {
  return (
    <>
      <Hero />

      <section className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6">
        <div className="mb-8 text-center">
          <span className="inline-block rounded-full border border-teal-600/20 bg-teal-50 px-3 py-1 text-xs font-medium text-teal-900">
            Capabilities
          </span>
          <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
            Everything you need to deliver
          </h2>
          <p className="mt-2 text-muted-foreground">
            Built around real agile workflows, not generic CRUD screens.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {homeFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className="transition-all hover:-translate-y-1 hover:border-teal-600/30 hover:shadow-md"
              >
                <CardHeader>
                  <span className="flex size-10 items-center justify-center rounded-lg bg-teal-600/10 text-teal-700">
                    <Icon className="size-5" />
                  </span>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="w-full border-y bg-muted/40">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="mb-8 text-center">
            <span className="inline-block rounded-full border border-teal-600/20 bg-teal-50 px-3 py-1 text-xs font-medium text-teal-900">
              For every role
            </span>
            <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
              Built for every role on your team
            </h2>
            <p className="mt-2 text-muted-foreground">
              Admins govern the platform, owners run workspaces, members
              deliver the work — each with a dashboard made for the job.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Admins govern",
                description:
                  "Platform overview, people and workspace management, audit trail.",
              },
              {
                step: "02",
                title: "Owners run",
                description:
                  "Workspaces, invites, teams, projects, sprints, and billing.",
              },
              {
                step: "03",
                title: "Members deliver",
                description:
                  "Boards, tasks, subtasks, discussions, files, and deadlines.",
              },
            ].map((item) => (
              <Card
                key={item.step}
                className="transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <CardHeader>
                  <span className="bg-gradient-to-br from-teal-700 to-teal-500 bg-clip-text text-sm font-bold text-transparent">
                    {item.step}
                  </span>
                  <CardTitle>{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{item.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-8 text-center">
          <span className="inline-block rounded-full border border-teal-600/20 bg-teal-50 px-3 py-1 text-xs font-medium text-teal-900">
            How it works
          </span>
          <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
            From signup to sprint in minutes
          </h2>
        </div>
        <ol className="grid gap-4 md:grid-cols-3">
          {steps.map((item) => (
            <li key={item.step}>
              <Card className="h-full transition-all hover:-translate-y-1 hover:shadow-md">
                <CardHeader>
                  <span className="bg-gradient-to-br from-teal-700 to-teal-500 bg-clip-text text-sm font-bold text-transparent">
                    {item.step}
                  </span>
                  <CardTitle>{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{item.description}</CardDescription>
                </CardContent>
              </Card>
            </li>
          ))}
        </ol>
      </section>

      <CtaBand />
    </>
  );
}
