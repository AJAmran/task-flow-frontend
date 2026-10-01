"use client";

import type { ReactNode } from "react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useGetMe } from "@/hooks";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { DashboardSidebar } from "./dashboard-sidebar";

export default function DashboardShell({ children }: { children: ReactNode }) {
  // AuthGuard (in layout) guarantees a user; cached profile resolves instantly.
  const { data } = useGetMe();
  const role = data?.data?.platformRole ?? "USER";

  return (
    <SidebarProvider>
      <DashboardSidebar role={role} />
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
