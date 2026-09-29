import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { homeFeatures } from "@/components/modules/homepage/home-data";

export const metadata: Metadata = {
  title: "Features — TaskFlow",
  description:
    "Kanban boards, sprint planning, teams, role-based dashboards, activity feeds, and bKash subscription billing.",
};

export default function FeaturesPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Features that cover the whole delivery cycle
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          Every screen maps to a real backend workflow — organizations,
          invitations, teams, projects, sprints, tasks, comments, attachments,
          and billing.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {homeFeatures.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card key={feature.title}>
              <CardHeader>
                <span className="flex size-10 items-center justify-center rounded-lg bg-muted">
                  <Icon className="size-5" />
                </span>
                <CardTitle>
                  {String(index + 1).padStart(2, "0")} — {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-12 rounded-xl border bg-muted/40 p-8 text-center">
        <h2 className="text-xl font-bold">See it with demo accounts</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
          Log in as Admin, Owner, or Member with one click and explore each
          dashboard. No signup needed for evaluation.
        </p>
        <div className="mt-4 flex justify-center gap-3">
          <Button render={<Link href="/login">Demo login</Link>}>
            Demo login
          </Button>
          <Button
            variant="outline"
            render={
              <Link href="/pricing">
                Compare plans <ArrowRight />
              </Link>
            }
          >
            Compare plans <ArrowRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
