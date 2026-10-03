import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CtaBand({
  title = "Ready to ship your next sprint?",
  description = "Create a free workspace, invite your team, and run your first sprint today.",
  primaryCta = "Start free",
  primaryHref = "/register",
  secondaryCta = "Explore features",
  secondaryHref = "/features",
}: {
  title?: string;
  description?: string;
  primaryCta?: string;
  primaryHref?: string;
  secondaryCta?: string;
  secondaryHref?: string;
}) {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6">
      <div className="relative overflow-hidden rounded-2xl bg-[#0a2e36] px-6 py-12 text-center sm:px-12 sm:py-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(45,212,191,0.25),transparent_45%),radial-gradient(circle_at_85%_80%,rgba(45,212,191,0.18),transparent_45%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.15] bg-[radial-gradient(rgba(255,255,255,0.7)_1px,transparent_1px)] bg-[size:22px_22px]"
        />
        <div className="relative flex flex-col items-center gap-4">
          <h2 className="max-w-2xl text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {title}
          </h2>
          <p className="max-w-xl text-sm text-teal-100/80 sm:text-base">
            {description}
          </p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              className="bg-teal-300 text-teal-950 hover:bg-teal-200"
              render={
                <Link href={primaryHref}>
                  {primaryCta} <ArrowRight />
                </Link>
              }
            >
              {primaryCta} <ArrowRight />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-teal-100/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
              render={<Link href={secondaryHref}>{secondaryCta}</Link>}
            >
              {secondaryCta}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
