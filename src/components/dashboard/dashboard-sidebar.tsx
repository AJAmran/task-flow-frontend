"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
  Activity,
  ArrowLeft,
  Building2,
  CalendarRange,
  ClipboardList,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  ScrollText,
  Settings,
  ShieldCheck,
  Users,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
} from "@/components/ui/sidebar";
import { toast } from "@/components/ui/toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMe, useLogout } from "@/hooks";
import { clearSession } from "@/lib/session";
import { adminRoutes, memberRoutes, ownerRoutes } from "@/routes";
import type { PlatformRole, SidebarIcon, SidebarItems } from "@/types";

const sidebarRoutes: Record<PlatformRole, SidebarItems> = {
  SUPER_ADMIN: adminRoutes,
  USER: ownerRoutes,
};

const routeIcons: Record<string, typeof LayoutDashboard> = {
  "/dashboard": LayoutDashboard,
  "/dashboard/activity": Activity,
  "/dashboard/payments": Wallet,
  "/dashboard/profile": Settings,
  "/organizations": Building2,
  "/admin": ShieldCheck,
  "/admin/users": Users,
  "/admin/organizations": Building2,
  "/admin/audit-logs": ScrollText,
};

const iconComponents = {
  dashboard: LayoutDashboard,
  activity: Activity,
  payments: Wallet,
  profile: Settings,
  workspaces: Building2,
  admin: ShieldCheck,
  users: Users,
  orgs: Building2,
  logs: ScrollText,
  overview: LayoutDashboard,
  people: Users,
  projects: FolderKanban,
  tasks: ClipboardList,
  sprints: CalendarRange,
  back: ArrowLeft,
} as const;

function iconForItem(url: string, icon?: SidebarIcon) {
  if (icon) {
    return iconComponents[icon];
  }
  return routeIcons[url] ?? null;
}

function isRouteActive(
  pathname: string,
  url: string,
  exact?: boolean,
) {
  if (pathname === url) {
    return true;
  }
  if (exact || url === "/dashboard" || url === "/admin") {
    return false;
  }
  return pathname.startsWith(`${url}/`);
}

function SidebarAccount() {
  const { data, isPending: isLoadingUser } = useGetMe();
  const { mutate: logout, isPending } = useLogout();
  const queryClient = useQueryClient();
  const router = useRouter();

  const user = data?.data;

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        clearSession();
        queryClient.removeQueries({ queryKey: ["user"] });
        toast.add({
          title: "Logged out",
          description: "You have been logged out successfully",
          type: "success",
        });
        router.push("/login");
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

  if (isLoadingUser) {
    return (
      <div className="flex flex-col gap-2 px-2" aria-label="Loading account">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

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

export function DashboardSidebar({
  role,
  items,
}: {
  role: PlatformRole;
  items?: SidebarItems;
}) {
  const pathname = usePathname();
  const routes: SidebarItems = items ?? sidebarRoutes[role] ?? memberRoutes;

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/dashboard" className="flex items-center gap-2 px-2 py-1">
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
                      isActive={isRouteActive(pathname, item.url, item.exact)}
                    >
                      {(() => {
                        const Icon = iconForItem(item.url, item.icon);
                        return Icon ? <Icon /> : null;
                      })()}
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
