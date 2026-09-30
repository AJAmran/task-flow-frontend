import type { Metadata } from "next";
import NewProjectSection from "@/components/modules/project/new-project-section";

export const metadata: Metadata = {
  title: "New Project — TaskFlow",
  description:
    "Create a project inside your organization. Attach a team, then plan sprints and tasks.",
};

export default async function NewProjectPage({
  params,
}: {
  params: Promise<{ organizationId: string }>;
}) {
  const { organizationId } = await params;

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="mx-auto flex w-full max-w-xl flex-col gap-1">
        <h2 className="text-lg font-semibold tracking-tight">New project</h2>
        <p className="text-sm text-muted-foreground">
          Set up a delivery workspace for your team
        </p>
      </div>
      <NewProjectSection organizationId={organizationId} />
    </div>
  );
}
