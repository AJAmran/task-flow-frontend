import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import CtaBand from "@/components/modules/homepage/CtaBand";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Pricing — TaskFlow",
  description:
    "Free, Pro, and Team plans for TaskFlow organizations. Upgrade with secure bKash sandbox payments.",
};

const plans = [
  {
    name: "Free",
    price: "৳0",
    period: "forever",
    description: "For trying TaskFlow with a small team.",
    features: ["Up to 3 projects", "Up to 5 members", "Kanban boards & sprints", "Community support"],
    cta: "Start free",
    href: "/register",
    highlight: false,
  },
  {
    name: "Pro",
    price: "৳499",
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
    href: "/register?plan=PRO",
    highlight: true,
  },
  {
    name: "Team",
    price: "৳999",
    period: "/month",
    description: "For organizations running multiple teams.",
    features: [
      "Everything in Pro",
      "Multiple teams per organization",
      "Advanced member roles",
      "Priority support",
    ],
    cta: "Upgrade to Team",
    href: "/register?plan=TEAM",
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Simple pricing per organization
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          Start free. Upgrade to Pro or Team when you need more projects and
          members. Payments are processed securely via bKash (sandbox test
          mode).
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={cn(plan.highlight && "border-primary ring-1 ring-primary")}
          >
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <p className="pt-2">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-sm text-muted-foreground">
                  {" "}
                  {plan.period}
                </span>
              </p>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col gap-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="size-4 shrink-0 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                variant={plan.highlight ? "default" : "outline"}
                nativeButton={false}
                render={<Link href={plan.href}>{plan.cta}</Link>}
              >
                {plan.cta}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <p className="mx-auto mt-8 max-w-2xl text-center text-xs text-muted-foreground">
        Plan limits (projects, members) are enforced by the backend
        subscription module. Upgrades create a real bKash sandbox payment with
        success and cancel redirects.
      </p>

      <div className="mt-8">
        <CtaBand
          title="Start free, upgrade when you grow"
          description="Every plan starts with the same boards, sprints, and role-based dashboards."
        />
      </div>
    </div>
  );
}
