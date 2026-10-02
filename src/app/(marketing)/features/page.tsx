import type { Metadata } from "next";
import CtaBand from "@/components/modules/homepage/CtaBand";
import { homeFeatures } from "@/components/modules/homepage/home-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Features — TaskFlow",
  description:
    "Kanban boards, sprint planning, teams, role-based dashboards, activity feeds, and bKash subscription billing.",
};

const spans = [
  "md:col-span-2",
  "",
  "",
  "md:col-span-2",
  "",
  "md:col-span-2 md:[grid-column:2/4]",
];

export default function FeaturesPage() {
  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(ellipse_50%_60%_at_50%_0%,rgba(45,212,191,0.12),transparent)]"
      />
      <div className="relative mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-10 text-center">
          <span className="inline-block rounded-full border border-teal-600/20 bg-teal-50 px-3 py-1 text-xs font-medium text-teal-900">
            Capabilities
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            Features that cover the{" "}
            <span className="bg-gradient-to-r from-teal-600 to-cyan-500 bg-clip-text text-transparent">
              whole delivery cycle
            </span>
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Every screen maps to a real backend workflow — workspaces,
            invitations, teams, projects, sprints, tasks, comments,
            attachments, and billing.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {homeFeatures.map((feature, index) => {
            const Icon = feature.icon;
            const big = index % 3 === 0;
            return (
              <Card
                key={feature.title}
                className={cn(
                  "group relative flex flex-col overflow-hidden transition-all hover:-translate-y-1 hover:border-teal-600/30 hover:shadow-md",
                  spans[index % spans.length],
                  big && "bg-gradient-to-br from-teal-50/60 via-card to-card",
                )}
              >
                <CardHeader>
                  <span className="flex size-11 items-center justify-center rounded-xl bg-teal-600/10 text-teal-700 transition-transform group-hover:scale-110">
                    <Icon className="size-5" />
                  </span>
                  <CardTitle className={cn(big && "text-xl")}>
                    <span className="mr-2 bg-gradient-to-br from-teal-700 to-teal-500 bg-clip-text font-bold text-transparent">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription
                    className={cn(big && "max-w-md text-[15px]")}
                  >
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-8">
          <CtaBand
            title="See every workflow live"
            description="Create a free workspace and run a sprint in minutes — boards, teams, billing included."
          />
        </div>
      </div>
    </div>
  );
}
