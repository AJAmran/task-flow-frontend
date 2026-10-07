"use client";

import { format } from "date-fns";
import {
  Ban,
  CheckCircle2,
  Crown,
  SearchX,
  ShieldCheck,
  User,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import AvatarInitials from "@/components/ui/avatar-initials";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TablePagination from "@/components/ui/table-pagination";
import { toast } from "@/components/ui/toast";
import { useAdminUsers, useGetMe, useUpdateUserStatus } from "@/hooks";
import useDebounce from "@/hooks/debounce.hook";
import type { AdminUser, ApiResponse, PlatformRole } from "@/types";

const PAGE_SIZE = 10;

export function AdminUsersSkeleton() {
  return (
    <div className="flex flex-col gap-4" aria-label="Loading users">
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-8 w-36" />
        <Skeleton className="h-8 w-32" />
      </div>
      <Skeleton className="h-80 w-full" />
    </div>
  );
}

export default function AdminUsersTable() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pageParam = Number(searchParams.get("page") ?? "1");
  const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
  const roleParam = searchParams.get("role") as PlatformRole | null;
  const platformRole =
    roleParam === "USER" || roleParam === "SUPER_ADMIN" ? roleParam : undefined;
  const activeParam = searchParams.get("active");
  const isActive =
    activeParam === "true" ? true : activeParam === "false" ? false : undefined;
  const urlSearch = searchParams.get("search") ?? "";

  const [searchInput, setSearchInput] = useState(urlSearch);

  useEffect(() => {
    setSearchInput((prev) => (prev === urlSearch ? prev : urlSearch));
  }, [urlSearch]);
  const debouncedSearch = useDebounce(searchInput);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const current = params.get("search") ?? "";
    if (debouncedSearch.trim() === current) {
      return;
    }
    if (debouncedSearch.trim()) {
      params.set("search", debouncedSearch.trim());
    } else {
      params.delete("search");
    }
    params.delete("page");
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [debouncedSearch, pathname, router, searchParams]);

  const setParam = (key: string, value?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const setPage = (next: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (next <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(next));
    }
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const { data, isPending, isError, refetch } = useAdminUsers({
    page,
    limit: PAGE_SIZE,
    ...(debouncedSearch.trim() && { search: debouncedSearch.trim() }),
    ...(platformRole && { platformRole }),
    ...(isActive !== undefined && { isActive }),
  });
  const queryClient = useQueryClient();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const { mutate: setStatus } = useUpdateUserStatus();
  const { data: meData } = useGetMe();
  const myId = meData?.data?.id;

  const users = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 0;
  const total = data?.meta?.total ?? 0;

  const handleToggle = (id: string, name: string, next: boolean) => {
    setPendingId(id);
    queryClient.setQueriesData<ApiResponse<AdminUser[]>>(
      { queryKey: ["admin", "users"] },
      (old) => {
        if (!old?.data || !Array.isArray(old.data)) {
          return old;
        }
        return {
          ...old,
          data: old.data.map((u) =>
            u.id === id ? { ...u, isActive: next } : u,
          ),
        };
      },
    );
    setStatus(
      { id, isActive: next },
      {
        onSuccess: () =>
          toast.add({
            title: next ? "User unblocked" : "User blocked",
            description: `${name} can${next ? " now" : " no longer"} sign in.`,
            type: "success",
          }),
        onError: (err) => {
          queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
          toast.add({
            title: "Action failed",
            description: err.message || "Please try again",
            type: "error",
          });
        },
        onSettled: () => setPendingId(null),
      },
    );
  };

  if (isPending) {
    return <AdminUsersSkeleton />;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border p-10 text-center">
        <p className="font-medium">Could not load users</p>
        <Button variant="outline" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end gap-2">
        <Field className="w-auto">
          <FieldLabel htmlFor="admin-user-search">Search</FieldLabel>
          <Input
            id="admin-user-search"
            type="search"
            placeholder="Search name or email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="sm:max-w-56"
            aria-label="Search users"
          />
        </Field>
        <Field className="w-auto">
          <FieldLabel htmlFor="admin-user-role">Role</FieldLabel>
          <Select
            value={platformRole ?? "ALL"}
            items={[
              { value: "ALL", label: "All roles" },
              { value: "USER", label: "User" },
              { value: "SUPER_ADMIN", label: "Super Admin" },
            ]}
            onValueChange={(val: string | null) =>
              setParam("role", val === "ALL" ? undefined : (val ?? undefined))
            }
          >
            <SelectTrigger id="admin-user-role" className="w-36" aria-label="Filter by role">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All roles</SelectItem>
              <SelectItem value="USER">User</SelectItem>
              <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field className="w-auto">
          <FieldLabel htmlFor="admin-user-status">Status</FieldLabel>
          <Select
            value={activeParam ?? "ALL"}
            items={[
              { value: "ALL", label: "All status" },
              { value: "true", label: "Active" },
              { value: "false", label: "Blocked" },
            ]}
            onValueChange={(val: string | null) =>
              setParam("active", val === "ALL" ? undefined : (val ?? undefined))
            }
          >
            <SelectTrigger id="admin-user-status" className="w-32" aria-label="Filter by status">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All status</SelectItem>
              <SelectItem value="true">Active</SelectItem>
              <SelectItem value="false">Blocked</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <p className="ml-auto text-sm text-muted-foreground">
          {total} user{total === 1 ? "" : "s"}
        </p>
      </div>

      {users.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed px-6 py-12 text-center">
          <span className="rounded-full bg-muted p-3">
            <SearchX className="size-5 text-muted-foreground" />
          </span>
          <p className="font-medium">No users match</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Try different search or filters.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
                <TableHead className="hidden lg:table-cell">Joined</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                const isSuper = user.platformRole === "SUPER_ADMIN";
                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <AvatarInitials name={user.name} />
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-medium">
                            {user.name}
                          </span>
                          <span className="block truncate text-xs text-muted-foreground">
                            {user.email}
                            {user._count.memberships > 0 &&
                              ` · ${user._count.memberships} org${user._count.memberships === 1 ? "" : "s"}`}
                          </span>
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={isSuper ? "default" : "secondary"}>
                        {isSuper ? (
                          <span className="flex items-center gap-1">
                            <ShieldCheck className="size-3" /> Admin
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <User className="size-3" /> User
                          </span>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge
                        variant={user.isActive ? "outline" : "destructive"}
                      >
                        {user.isActive ? (
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="size-3" /> Active
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <Ban className="size-3" /> Blocked
                          </span>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden text-muted-foreground lg:table-cell">
                      {format(new Date(user.createdAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      {isSuper || user.id === myId ? (
                        <span className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
                          <Crown className="size-3" />{" "}
                          {user.id === myId ? "You" : "Protected"}
                        </span>
                      ) : (
                        <Button
                          variant={user.isActive ? "destructive" : "outline"}
                          size="sm"
                          disabled={pendingId !== null}
                          onClick={() =>
                            handleToggle(user.id, user.name, !user.isActive)
                          }
                        >
                          {pendingId === user.id ? (
                            <Spinner />
                          ) : user.isActive ? (
                            "Block"
                          ) : (
                            "Unblock"
                          )}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {totalPages > 1 && (
        <TablePagination
          page={page}
          totalPages={totalPages}
          handlePageChange={(next) =>
            setPage(typeof next === "function" ? next(page) : next)
          }
        />
      )}
    </div>
  );
}
