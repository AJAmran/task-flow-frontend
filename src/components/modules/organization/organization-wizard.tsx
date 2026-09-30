"use client";

import { ArrowLeft, ArrowRight, Building2, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import CreateOrganizationForm from "@/components/form/create-organization-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const steps = [
  {
    step: "01",
    title: "Details",
    description: "Name your workspace",
  },
  {
    step: "02",
    title: "Review & create",
    description: "Confirm and launch",
  },
];

export default function OrganizationWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [createdId, setCreatedId] = useState<string | null>(null);

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
      <ol className="grid gap-2 sm:grid-cols-2">
        {steps.map((item, index) => (
          <li key={item.step}>
            <div
              className={cn(
                "flex items-center gap-3 rounded-xl border p-4",
                index === step && "border-primary ring-1 ring-primary",
                index < step && "bg-muted/40",
              )}
              aria-current={index === step ? "step" : undefined}
            >
              <span className="text-sm font-bold text-muted-foreground">
                {item.step}
              </span>
              <span>
                <span className="block text-sm font-medium">{item.title}</span>
                <span className="block text-xs text-muted-foreground">
                  {item.description}
                </span>
              </span>
            </div>
          </li>
        ))}
      </ol>

      {step === 0 && (
        <Card>
          <CardHeader>
            <span className="flex size-10 items-center justify-center rounded-lg bg-muted">
              <Building2 className="size-5" />
            </span>
            <CardTitle>Organization details</CardTitle>
            <CardDescription>
              This is the workspace your teams, projects and billing belong to.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <CreateOrganizationForm
              onSuccess={(id) => {
                setCreatedId(id);
                setStep(1);
              }}
            />
            <p className="text-center text-xs text-muted-foreground">
              You will become the owner with full control.
            </p>
          </CardContent>
        </Card>
      )}

      {step === 1 && (
        <Card>
          <CardHeader>
            <span className="flex size-10 items-center justify-center rounded-lg bg-muted">
              <CheckCircle2 className="size-5 text-primary" />
            </span>
            <CardTitle>Workspace ready</CardTitle>
            <CardDescription>
              Your organization was created. Next: invite teammates, create a
              team, then start a project.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 sm:flex-row">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setStep(0)}
            >
              <ArrowLeft /> Back
            </Button>
            <Button
              className="flex-1"
              onClick={() =>
                router.push(
                  createdId ? `/organizations/${createdId}` : "/organizations",
                )
              }
            >
              {createdId ? "Open organization" : "Go to organizations"}
              <ArrowRight />
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
