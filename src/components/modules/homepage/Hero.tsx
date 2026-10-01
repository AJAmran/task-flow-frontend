import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const workflow = ["Todo", "In Progress", "In Review", "Done"];

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(45,212,191,0.18),transparent),radial-gradient(ellipse_40%_35%_at_85%_20%,rgba(45,212,191,0.1),transparent)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35] bg-[radial-gradient(rgba(13,60,70,0.14)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]"
      />
      <div className="relative mx-auto flex w-full max-w-7xl flex-col items-center gap-6 px-4 py-16 text-center sm:px-6 sm:py-24">
        <span className="flex items-center gap-2 rounded-full border border-teal-600/20 bg-teal-50 px-3 py-1 text-xs font-medium text-teal-900">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-500 opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-teal-600" />
          </span>
          Sprint planning • Kanban • Team analytics
        </span>
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
          Ship projects faster with{" "}
          <span className="bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
            TaskFlow
          </span>
        </h1>
        <p className="max-w-2xl text-balance text-base text-muted-foreground sm:text-lg">
          One workspace for organizations, teams, projects, sprints, and tasks.
          Plan work, review progress, and keep every member aligned — from
          backlog to done.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            size="lg"
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
            render={
              <Link href="/login">
                <Play /> Try demo login
              </Link>
            }
          >
            <Play /> Try demo login
          </Button>
        </div>

        <div
          aria-hidden
          className="mt-4 flex flex-wrap items-center justify-center gap-2"
        >
          {workflow.map((stage, i) => (
            <span key={stage} className="flex items-center gap-2">
              <span
                className={
                  i === workflow.length - 1
                    ? "rounded-full bg-teal-600 px-3 py-1 text-xs font-semibold text-white"
                    : "rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground"
                }
              >
                {stage}
              </span>
              {i < workflow.length - 1 && (
                <ArrowRight className="size-3 text-teal-600/60" />
              )}
            </span>
          ))}
        </div>

        <dl className="grid w-full max-w-2xl grid-cols-1 gap-4 pt-6 sm:grid-cols-3">
          {[
            ["3", "Distinct roles"],
            ["18+", "App pages"],
            ["4", "Task workflow stages"],
          ].map(([value, label]) => (
            <div
              key={label}
              className="flex flex-col gap-1 rounded-xl border bg-card/80 p-4 shadow-sm backdrop-blur"
            >
              <dt className="order-2 text-sm text-muted-foreground">{label}</dt>
              <dd className="order-1 bg-gradient-to-br from-teal-700 to-teal-500 bg-clip-text text-2xl font-bold text-transparent">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
