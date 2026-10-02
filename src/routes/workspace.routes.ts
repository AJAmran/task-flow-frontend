import type { SidebarItems } from "@/types/sidebar.type";

export function orgSidebarRoutes(organizationId: string): SidebarItems {
  const base = `/organizations/${organizationId}`;

  return [
    {
      title: "Workspace",
      items: [
        { title: "Overview", url: base, exact: true, icon: "overview" },
        { title: "People", url: `${base}/people`, icon: "people" },
        { title: "Projects", url: `${base}/projects`, icon: "projects" },
        { title: "My Tasks", url: `${base}/tasks`, icon: "tasks" },
      ],
    },
    {
      title: "Navigate",
      items: [
        { title: "All workspaces", url: "/organizations", icon: "back" },
      ],
    },
  ];
}

export function projectSidebarRoutes(
  organizationId: string,
  projectId: string,
): SidebarItems {
  const orgBase = `/organizations/${organizationId}`;
  const base = `${orgBase}/projects/${projectId}`;

  return [
    {
      title: "Project",
      items: [
        { title: "Overview", url: base, exact: true, icon: "overview" },
        { title: "Tasks", url: `${base}/tasks`, icon: "tasks" },
        { title: "Sprints", url: `${base}/sprints`, icon: "sprints" },
        { title: "Activity", url: `${base}/activity`, icon: "activity" },
      ],
    },
    {
      title: "Navigate",
      items: [
        { title: "All projects", url: `${orgBase}/projects`, icon: "back" },
        { title: "Workspace", url: orgBase, icon: "workspaces" },
      ],
    },
  ];
}
