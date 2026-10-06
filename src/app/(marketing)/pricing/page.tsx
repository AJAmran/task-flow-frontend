import { Check, Gift, Receipt, Rocket, ShieldCheck, Zap } from "lucide-react";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import CtaBand from "@/components/modules/homepage/CtaBand";
import Reveal from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { SESSION_COOKIE } from "@/lib/session";

export const metadata: Metadata = {
  title: "Pricing — TaskFlow",
  description:
    "Free, Pro, and Team plans for TaskFlow organizations. Upgrade with secure bKash sandbox payments.",
};

const plans = [
  {
    name: "Free",
    icon: Gift,
    price: "৳0",
    period: "forever",
    description: "For trying TaskFlow with a small team.",
    features: [
      "Up to 3 projects",
      "Up to 5 members",
      "Kanban boards & sprints",
      "Community support",
    ],
    cta: "Start free",
    plan: null as string | null,
    highlight: false,
    badge: null as string | null,
  },
  {
    name: "Pro",
    icon: Zap,
    price: "৳500",
    period: "/month",
    description: "For growing teams that ship every sprint.",
    features: [
      "Up to 20 projects",
      "Up to 50 members",
      "Everything in Free",
      "Activity analytics",
      "bKash subscription billing",
    ],
    cta: "Upgrade to Pro",
    plan: "PRO",
    highlight: true,
    badge: "Most popular",
  },
  {
    name: "Team",
    icon: Rocket,
    price: "৳1000",
    period: "/month",
    description: "For organizations running multiple teams.",
    features: [
      "Everything in Pro",
      "Up to 50 projects",
      "Up to 200 members",
      "Priority support",
    ],
    cta: "Upgrade to Team",
    plan: "TEAM",
    highlight: false,
    badge: null as string | null,
  },
];

const assurances = [
  {
    icon: ShieldCheck,
    title: "Secure checkout",
    description: "Payments run through bKash test-mode checkout.",
  },
  {
    icon: Zap,
    title: "Instant activation",
    description: "Plans and limits apply the moment payment succeeds.",
  },
  {
    icon: Receipt,
    title: "Full history",
    description: "Every payment lands in Billing with status and trxID.",
  },
];

export default async function PricingPage() {
  const cookieStore = await cookies();
  const loggedIn = cookieStore.has(SESSION_COOKIE);
  const hrefFor = (plan: string | null) =>
    loggedIn
      ? plan
        ? `/dashboard/payments?plan=${plan}`
        : "/dashboard"
      : plan
        ? `/register?plan=${plan}`
        : "/register";

  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(ellipse_50%_60%_at_50%_0%,rgba(45,212,191,0.15),transparent)]"
      />
      <div className="relative mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-10 text-center">
          <span className="inline-block rounded-full border border-teal-600/20 bg-teal-50 px-3 py-1 text-xs font-medium text-teal-900">
            Test-mode billing · bKash sandbox
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            Simple pricing per{" "}
            <span className="bg-gradient-to-r from-teal-600 to-cyan-500 bg-clip-text text-transparent">
              organization
            </span>
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Start free. Upgrade to Pro or Team when you need more projects
            and members.
          </p>
        </div>

        <div className="grid items-stretch gap-4 md:grid-cols-3 lg:gap-6">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <Reveal key={plan.name} delay={index * 90} className="h-full">
              <Card
                key={plan.name}
                className={cn(
                  "relative flex flex-col overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg",
                  plan.highlight
                    ? "border-teal-600/40 shadow-md ring-1 ring-teal-600/30 md:scale-[1.03]"
                    : "hover:border-teal-600/30",
                )}
              >
                {plan.highlight && (
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal-500 via-cyan-400 to-teal-500"
                  />
                )}
                {plan.badge && (
                  <span className="absolute top-4 right-4 rounded-full bg-teal-600 px-2.5 py-0.5 text-[11px] font-bold text-white">
                    {plan.badge}
                  </span>
                )}
                <CardHeader>
                  <span
                    className={cn(
                      "flex size-11 items-center justify-center rounded-xl",
                      plan.highlight
                        ? "bg-teal-600 text-white"
                        : "bg-teal-600/10 text-teal-700",
                    )}
                  >
                    <Icon className="size-5" />
                  </span>
                  <CardTitle className="pt-1">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <p className="pt-1">
                    <span
                      className={cn(
                        "text-4xl font-bold tracking-tight",
                        plan.highlight &&
                          "bg-gradient-to-br from-teal-700 to-teal-500 bg-clip-text text-transparent",
                      )}
                    >
                      {plan.price}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {" "}
                      {plan.period}
                    </span>
                  </p>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="flex flex-col gap-2.5">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 text-sm"
                      >
                        <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-teal-600/10">
                          <Check className="size-3 text-teal-700" />
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="mt-auto">
                  <Button
                    className={cn(
                      "w-full",
                      plan.highlight && "bg-teal-600 hover:bg-teal-700",
                    )}
                    variant={plan.highlight ? "default" : "outline"}
                    render={<Link href={hrefFor(plan.plan)}>{plan.cta}</Link>}
                  >
                    {plan.cta}
                  </Button>
                </CardFooter>
              </Card>
              </Reveal>
            );
          })}
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-3">
          {assurances.map((item, index) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} delay={index * 80}>
              <div className="flex h-full items-start gap-3 rounded-xl border bg-card p-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-teal-600/10 text-teal-700">
                  <Icon className="size-4" />
                </span>
                <span>
                  <span className="block text-sm font-semibold">
                    {item.title}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {item.description}
                  </span>
                </span>
              </div>
              </Reveal>
            );
          })}
        </div>

        <p className="mx-auto mt-8 max-w-2xl text-center text-xs text-muted-foreground">
          Plan limits (projects, members) are enforced by the backend
          subscription module. Upgrades create a real bKash sandbox payment
          with success and cancel redirects.
        </p>

        <div className="mt-8">
          <Reveal>
            <CtaBand
              title="Start free, upgrade when you grow"
              description="Every plan starts with the same boards, sprints, and role-based dashboards."
            />
          </Reveal>
        </div>
      </div>
    </div>
  );
}
