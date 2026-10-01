"use client";

import { useRouter } from "next/navigation";
import CreateProjectForm from "@/components/form/create-project-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function NewProjectSection({
  organizationId,
}: {
  organizationId: string;
}) {
  const router = useRouter();

  return (
    <Card className="mx-auto w-full max-w-xl">
      <CardHeader>
        <CardTitle>Create a project</CardTitle>
        <CardDescription>
          Projects group sprints and tasks. You can attach a team now or later.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CreateProjectForm
          organizationId={organizationId}
          onSuccess={(projectId) =>
            router.push(
              projectId
                ? `/organizations/${organizationId}/projects/${projectId}`
                : `/organizations/${organizationId}/projects`,
            )
          }
        />
      </CardContent>
    </Card>
  );
}
