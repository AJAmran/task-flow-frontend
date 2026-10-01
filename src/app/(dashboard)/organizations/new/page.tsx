import type { Metadata } from "next";
import OrganizationWizard from "@/components/modules/organization/organization-wizard";

export const metadata: Metadata = {
  title: "New Workspace — TaskFlow",
  description:
    "Create a new TaskFlow workspace and invite your team to start collaborating.",
};

export default function NewOrganizationPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-6">
      <div className="mx-auto flex w-full max-w-xl flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">
          Create a workspace
        </h1>
        <p className="text-sm text-muted-foreground">
          Set up a workspace for your company, client or crew
        </p>
      </div>
      <OrganizationWizard />
    </div>
  );
}
