import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
    icon: MessageCircle,
    title: "Live evaluation",
    description: "Trying the assignment demo?",
    value: "Use one-click demo login",
  },
];

const faqs = [
  {
    q: "How do I try TaskFlow without signing up?",
    a: "Open the login page and use one of the three Demo Login buttons — Super Admin, Org Owner, or Member. Each logs you in instantly and lands on the right dashboard.",
  },
  {
    q: "How do organizations and invitations work?",
    a: "An Org Owner creates an organization and invites people by email. Invited users accept from the invitation link and appear as members with the MEMBER role.",
  },
  {
    q: "How does billing work?",
    a: "Organizations start on the Free plan. Owners upgrade to Pro or Team through a real bKash sandbox payment with success and cancel redirects. Plan limits are enforced by the backend.",
  },
  {
    q: "Which roles exist?",
    a: "Three: Super Admin (platform governance), Org Owner (organizations, teams, projects, billing), and Member (tasks and collaboration).",
  },
];

export default function ContactPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Contact & support
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          Questions about TaskFlow, billing, or the demo? Start here.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {channels.map((channel) => {
          const Icon = channel.icon;
          return (
            <Card key={channel.title}>
              <CardHeader>
                <span className="flex size-10 items-center justify-center rounded-lg bg-muted">
                  <Icon className="size-5" />
                </span>
                <CardTitle>{channel.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-1">
                <CardDescription>{channel.description}</CardDescription>
                <p className="text-sm font-medium">{channel.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mx-auto mt-12 max-w-3xl">
        <h2 className="mb-4 text-center text-xl font-bold">
          Frequently asked questions
        </h2>
        <Accordion>
          {faqs.map((faq, index) => (
            <AccordionItem key={faq.q} value={`item-${index}`}>
              <AccordionTrigger>{faq.q}</AccordionTrigger>
              <AccordionContent>{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <div className="mt-8 text-center">
          <Button render={<Link href="/register">Create free account</Link>}>
            Create free account
          </Button>
        </div>
      </div>
    </div>
  );
}
