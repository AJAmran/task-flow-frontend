"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/assets/logo";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { toast } from "@/components/ui/toast";
import { useGetMe, useLogout } from "@/hooks";
import { clearSession } from "@/lib/session";
import { cn } from "@/lib/utils";

const routes = [
  { name: "Home", url: "/" },
  { name: "Features", url: "/features" },
  { name: "Pricing", url: "/pricing" },
  { name: "About", url: "/about" },
  { name: "Contact", url: "/contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { data, isPending } = useGetMe();
  const { mutate: logout, isPending: logoutPending } = useLogout();
  const queryClient = useQueryClient();

  const user = data?.data;
  const dashboardUrl =
    user?.platformRole === "SUPER_ADMIN" ? "/admin" : "/dashboard";

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        clearSession();
        queryClient.clear();
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

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Logo size={32} href="" />
          <span>TaskFlow</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {routes.map((route) => (
            <Button
              key={route.url}
              variant="ghost"
              size="sm"
              nativeButton={false}
              render={<Link href={route.url}>{route.name}</Link>}
              className={cn(pathname === route.url && "bg-muted")}
            >
              {route.name}
            </Button>
          ))}
          {isPending ? (
            <Skeleton className="h-7 w-20" aria-label="Loading account" />
          ) : (
            user && (
              <Button
                variant="ghost"
                size="sm"
                nativeButton={false}
                render={<Link href={dashboardUrl}>Dashboard</Link>}
              >
                Dashboard
              </Button>
            )
          )}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          {isPending ? (
            <>
              <Skeleton className="h-7 w-16" aria-label="Loading account" />
              <Skeleton className="h-7 w-24" aria-hidden />
            </>
          ) : !user ? (
            <>
              <Button
                variant="outline"
                size="sm"
                nativeButton={false}
                render={<Link href="/login">Login</Link>}
              >
                Login
              </Button>
              <Button
                size="sm"
                nativeButton={false}
                render={<Link href="/register">Get Started</Link>}
              >
                Get Started
              </Button>
            </>
          ) : (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleLogout}
              disabled={logoutPending}
            >
              Logout
            </Button>
          )}
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setOpen((prev) => !prev)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t px-4 py-3 md:hidden">
          {routes.map((route) => (
            <Button
              key={route.url}
              variant="ghost"
              size="sm"
              className="justify-start"
              nativeButton={false}
              render={
                <Link href={route.url} onClick={() => setOpen(false)}>
                  {route.name}
                </Link>
              }
            >
              {route.name}
            </Button>
          ))}
          {isPending ? (
            <div className="px-2 py-1.5" aria-label="Loading account">
              <Skeleton className="h-7 w-full" />
            </div>
          ) : (
            user && (
              <Button
                variant="ghost"
                size="sm"
                className="justify-start"
                nativeButton={false}
                render={
                  <Link href={dashboardUrl} onClick={() => setOpen(false)}>
                    Dashboard
                  </Link>
                }
              >
                Dashboard
              </Button>
            )
          )}
          {isPending ? (
            <div className="flex gap-2 pt-2" aria-label="Loading account">
              <Skeleton className="h-7 flex-1" />
              <Skeleton className="h-7 flex-1" />
            </div>
          ) : !user ? (
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                nativeButton={false}
                render={
                  <Link href="/login" onClick={() => setOpen(false)}>
                    Login
                  </Link>
                }
              >
                Login
              </Button>
              <Button
                size="sm"
                className="flex-1"
                nativeButton={false}
                render={
                  <Link href="/register" onClick={() => setOpen(false)}>
                    Get Started
                  </Link>
                }
              >
                Get Started
              </Button>
            </div>
          ) : (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleLogout}
              disabled={logoutPending}
            >
              Logout
            </Button>
          )}
        </nav>
      )}
    </header>
  );
}
