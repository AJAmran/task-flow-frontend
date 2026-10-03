import { Clock, Mail, Rocket } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Reveal from "@/components/ui/reveal";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Contact — TaskFlow",
  description:
    "Reach the TaskFlow team, browse support channels, and read answers to common questions.",
};

const channels = [
  {
    icon: Mail,
    title: "Support email",
    description: "For account, billing, and technical issues.",
    value: "support@taskflow.app",
  },
  {
    icon: Clock,
    title: "Response time",
    description: "We reply on business days.",
    value: "Within 24 hours",
  },
  {
    icon: Rocket,
    title: "Getting started",
    description: "New here? Create an account in a minute.",
    value: "Free forever plan",
  },
];

const faqs = [
  {
    q: "How do I get started?",
    a: "Create an account, verify your email with the 6-digit code, then create a workspace. Invite teammates from the People section and start your first project — the dashboard guides each step.",
  },
  {
    q: "How do workspaces and invitations work?",
    a: "A workspace Owner creates the workspace and invites people by email. Invited users accept from the invitation link and appear as members with the MEMBER role.",
  },
  {
    q: "How does billing work?",
    a: "Organizations start on the Free plan. Owners upgrade to Pro or Team through a real bKash sandbox payment with success and cancel redirects. Plan limits are enforced by the backend.",
  },
  {
    q: "Which roles exist?",
    a: "Three: Super Admin (platform governance), Workspace Owner (workspaces, teams, projects, billing), and Member (tasks and collaboration).",
  },
];

export default function ContactPage() {
  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(ellipse_50%_60%_at_50%_0%,rgba(45,212,191,0.12),transparent)]"
      />
      <div className="relative mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-10 text-center">
          <span className="inline-block rounded-full border border-teal-600/20 bg-teal-50 px-3 py-1 text-xs font-medium text-teal-900">
            Support
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            Contact &{" "}
            <span className="bg-gradient-to-r from-teal-600 to-cyan-500 bg-clip-text text-transparent">
              support
            </span>
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Questions about TaskFlow or billing? Start here.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {channels.map((channel, index) => {
            const Icon = channel.icon;
            return (
              <Reveal key={channel.title} delay={index * 80} className="h-full">
              <Card className="h-full transition-all hover:-translate-y-1 hover:border-teal-600/30 hover:shadow-md">
                <CardHeader>
                  <span className="flex size-10 items-center justify-center rounded-lg bg-teal-600/10 text-teal-700">
                    <Icon className="size-5" />
                  </span>
                  <CardTitle>{channel.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-1">
                  <CardDescription>{channel.description}</CardDescription>
                  <p className="text-sm font-medium">{channel.value}</p>
                </CardContent>
              </Card>
              </Reveal>
            );
          })}
        </div>

      <div className="mx-auto mt-12 max-w-3xl">
        <div className="mb-4 text-center">
          <span className="inline-block rounded-full border border-teal-600/20 bg-teal-50 px-3 py-1 text-xs font-medium text-teal-900">
            FAQ
          </span>
          <h2 className="mt-3 text-xl font-bold">
            Frequently asked questions
          </h2>
        </div>
        <Accordion>
          {faqs.map((faq, index) => (
            <AccordionItem key={faq.q} value={`item-${index}`}>
              <AccordionTrigger>{faq.q}</AccordionTrigger>
              <AccordionContent>{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <div className="mt-8 text-center">
          <Button
            render={<Link href="/register">Create free account</Link>}
          >
            Create free account
          </Button>
        </div>
        </div>
      </div>
    </div>
  );
}
