import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col items-center gap-6 px-4 py-16 text-center sm:px-6 sm:py-24">
      <span className="rounded-full border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
        Sprint planning • Kanban • Team analytics
      </span>
      <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
        Ship projects faster with TaskFlow
      </h1>
      <p className="max-w-2xl text-balance text-base text-muted-foreground sm:text-lg">
        One workspace for organizations, teams, projects, sprints, and tasks.
        Plan work, review progress, and keep every member aligned — from backlog
        to done.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          size="lg"
          nativeButton={false}
          render={
            <Link href="/register">
              Start free <ArrowRight />
            </Link>
          }
        >
          Start free <ArrowRight />
        </Button>
        <Button
          size="lg"
          variant="outline"
          nativeButton={false}
          render={
            <Link href="/login">
              <Play /> Try demo login
            </Link>
          }
        >
          <Play /> Try demo login
        </Button>
      </div>
      <dl className="grid w-full max-w-2xl grid-cols-1 gap-4 pt-6 sm:grid-cols-3">
        {[
          ["3", "Distinct roles"],
          ["18+", "App pages"],
          ["4", "Task workflow stages"],
        ].map(([value, label]) => (
          <div
            key={label}
            className="flex flex-col gap-1 rounded-xl border bg-card p-4"
          >
            <dt className="order-2 text-sm text-muted-foreground">{label}</dt>
            <dd className="order-1 text-2xl font-bold">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
