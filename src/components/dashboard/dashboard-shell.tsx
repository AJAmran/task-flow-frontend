"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useGetMe } from "@/hooks";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import type { SidebarItems } from "@/types";
import {
  orgSidebarRoutes,
  projectSidebarRoutes,
} from "@/routes/workspace.routes";
import { DashboardSidebar } from "./dashboard-sidebar";

function contextItems(pathname: string): SidebarItems | null {
  const segments = pathname.split("/").filter(Boolean);
  if (segments[0] !== "organizations" || !segments[1]) {
    return null;
  }
  const organizationId = segments[1];
  if (segments[2] === "projects" && segments[3]) {
    return projectSidebarRoutes(organizationId, segments[3]);
  }
  return orgSidebarRoutes(organizationId);
}

export default function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  // AuthGuard (in layout) guarantees a user; cached profile resolves instantly.
  const { data } = useGetMe();
  const role = data?.data?.platformRole ?? "USER";
  const items = contextItems(pathname);

  return (
    <SidebarProvider>
      <DashboardSidebar role={role} items={items ?? undefined} />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center justify-between border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <span className="text-sm font-medium">TaskFlow workspace</span>
          </div>
          <ThemeToggle />
        </header>
        <main className="flex flex-1 flex-col">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
