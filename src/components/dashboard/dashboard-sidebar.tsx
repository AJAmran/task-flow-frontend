"use client";

import { useQueryClient } from "@tanstack/react-query";
import { LayoutDashboard, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/assets/logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { toast } from "@/components/ui/toast";
import { useGetMe, useLogout } from "@/hooks";
import { adminRoutes, memberRoutes, ownerRoutes } from "@/routes";
import type { PlatformRole, SidebarItems } from "@/types";

const sidebarRoutes: Record<PlatformRole, SidebarItems> = {
  SUPER_ADMIN: adminRoutes,
  USER: ownerRoutes,
};

function isRouteActive(pathname: string, url: string) {
  if (pathname === url) {
    return true;
  }
  if (url === "/dashboard" || url === "/admin") {
    return false;
  }
  return pathname.startsWith(`${url}/`);
}

function SidebarAccount() {
  const { data } = useGetMe();
  const { mutate: logout, isPending } = useLogout();
  const queryClient = useQueryClient();

  const user = data?.data;

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        queryClient.removeQueries({ queryKey: ["user"] });
        toast.add({
          title: "Logged out",
          description: "You have been logged out successfully",
          type: "success",
        });
      },
      onError: () => {
        toast.add({
          title: "Logout failed",
          description: "Something went wrong",
          type: "error",
        });
      },
    });
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex min-w-0 flex-col px-2">
        <span className="truncate text-sm font-medium">{user.name}</span>
        <span className="truncate text-xs text-muted-foreground">
          {user.email}
        </span>
      </div>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton onClick={handleLogout} disabled={isPending}>
            <LogOut /> Logout
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </div>
  );
}

export function DashboardSidebar({ role }: { role: PlatformRole }) {
  const pathname = usePathname();
  const routes: SidebarItems = sidebarRoutes[role] ?? memberRoutes;

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2 px-2 py-1">
          <Logo href="" />
          <span className="font-semibold">TaskFlow</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {routes.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      render={<Link href={item.url} />}
                      isActive={isRouteActive(pathname, item.url)}
                    >
                      {item.url === "/dashboard" || item.url === "/admin" ? (
                        <LayoutDashboard />
                      ) : null}
                      {item.title}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarAccount />
      </SidebarFooter>
    </Sidebar>
  );
}
