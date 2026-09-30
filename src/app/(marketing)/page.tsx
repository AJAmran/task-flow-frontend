import type { Metadata } from "next";
import Link from "next/link";
import { Crown, ShieldCheck, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Hero from "@/components/modules/homepage/Hero";
import CtaBand from "@/components/modules/homepage/CtaBand";
import { homeFeatures } from "@/components/modules/homepage/home-data";

export const metadata: Metadata = {
  title: "TaskFlow — Project Management for Modern Teams",
  description:
    "Plan sprints, track tasks on Kanban boards, manage teams, and bill subscriptions. One workspace for your whole organization.",
};

const roles = [
  {
    icon: ShieldCheck,
    title: "Super Admin",
    description:
      "Platform overview, user and organization management, audit logs, and billing insight.",
    href: "/login",
  },
  {
    icon: Crown,
    title: "Org Owner",
    description:
      "Create organizations, invite members, manage teams and projects, upgrade plans.",
    href: "/login",
  },
  {
    icon: User,
    title: "Member",
    description:
      "Join teams, pick up tasks, move cards across the board, and track personal activity.",
    href: "/login",
  },
];

const steps = [
  {
    step: "01",
    title: "Create your organization",
    description:
      "Sign up, verify your email, and create an organization for your company or client.",
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
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
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
              <Card key={feature.title}>
                <CardHeader>
                  <span className="flex size-10 items-center justify-center rounded-lg bg-muted">
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
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              One login away from your role
            </h2>
            <p className="mt-2 text-muted-foreground">
              Evaluators can try every workflow with one-click demo accounts.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {roles.map((role) => {
              const Icon = role.icon;
              return (
                <Card key={role.title}>
                  <CardHeader>
                    <span className="flex size-10 items-center justify-center rounded-lg bg-muted">
                      <Icon className="size-5" />
                    </span>
                    <CardTitle>{role.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4">
                    <CardDescription>{role.description}</CardDescription>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-fit"
                      nativeButton={false}
                      render={<Link href={role.href}>Try it</Link>}
                    >
                      Try it
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            From signup to sprint in minutes
          </h2>
        </div>
        <ol className="grid gap-4 md:grid-cols-3">
          {steps.map((item) => (
            <li key={item.step}>
              <Card className="h-full">
                <CardHeader>
                  <span className="text-sm font-bold text-muted-foreground">
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
