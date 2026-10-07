"use client";

import { Building2, SearchX } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
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
import { useAdminOrganizations, useUpdateOrganizationStatus } from "@/hooks";
import type { AdminOrganization, AdminOrgStatus, ApiResponse } from "@/types";

const PAGE_SIZE = 10;

export function AdminOrgsSkeleton() {
  return (
    <div className="flex flex-col gap-4" role="status" aria-label="Loading organizations">
      <Skeleton className="h-8 w-40" />
      <Skeleton className="h-80 w-full" />
    </div>
  );
}

export default function AdminOrgsTable() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pageParam = Number(searchParams.get("page") ?? "1");
  const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
  const statusParam = searchParams.get("status");
  const status =
    statusParam === "ACTIVE" || statusParam === "SUSPENDED"
      ? (statusParam as AdminOrgStatus)
      : undefined;

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

  const { data, isPending, isError, refetch } = useAdminOrganizations({
    page,
    limit: PAGE_SIZE,
    ...(status && { status }),
  });
  const queryClient = useQueryClient();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const { mutate: setStatus } = useUpdateOrganizationStatus();

  const orgs = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 0;
  const total = data?.meta?.total ?? 0;

  const handleToggle = (id: string, name: string, next: AdminOrgStatus) => {
    setPendingId(id);
    queryClient.setQueriesData<ApiResponse<AdminOrganization[]>>(
      { queryKey: ["admin", "organizations"] },
      (old) => {
        if (!old?.data || !Array.isArray(old.data)) {
          return old;
        }
        return {
          ...old,
          data: old.data.map((o) =>
            o.id === id ? { ...o, status: next } : o,
          ),
        };
      },
    );
    setStatus(
      { id, status: next },
      {
        onSuccess: () =>
          toast.add({
            title:
              next === "SUSPENDED"
                ? "Organization suspended"
                : "Organization reactivated",
            description: `${name} is now ${next.toLowerCase()}.`,
            type: "success",
          }),
        onError: (err) => {
          queryClient.invalidateQueries({
            queryKey: ["admin", "organizations"],
          });
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
    return <AdminOrgsSkeleton />;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border p-10 text-center">
        <p className="font-medium">Could not load organizations</p>
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
          <FieldLabel htmlFor="admin-org-status">Status</FieldLabel>
          <Select
            value={status ?? "ALL"}
            items={[
              { value: "ALL", label: "All status" },
              { value: "ACTIVE", label: "Active" },
              { value: "SUSPENDED", label: "Suspended" },
            ]}
            onValueChange={(val: string | null) =>
              setParam("status", val === "ALL" ? undefined : (val ?? undefined))
            }
          >
            <SelectTrigger id="admin-org-status" className="w-40" aria-label="Filter by status">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All status</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="SUSPENDED">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <p className="ml-auto text-sm text-muted-foreground">
          {total} organization{total === 1 ? "" : "s"}
        </p>
      </div>

      {orgs.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed px-6 py-12 text-center">
          <span className="rounded-full bg-muted p-3">
            <SearchX className="size-5 text-muted-foreground" />
          </span>
          <p className="font-medium">No organizations match</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Try a different status filter.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Organization</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead className="hidden sm:table-cell">Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orgs.map((org) => {
                const suspended = org.status === "SUSPENDED";
                return (
                  <TableRow key={org.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-teal-600/10 text-teal-700">
                          <Building2 className="size-4" />
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-medium">
                            {org.name}
                          </span>
                          <span className="block truncate text-xs text-muted-foreground">
                            /{org.slug} · {org._count.members} members ·{" "}
                            {org._count.projects} projects
                          </span>
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="block max-w-40 truncate text-sm">
                        {org.owner?.name ?? "—"}
                      </span>
                      <span className="block max-w-40 truncate text-xs text-muted-foreground">
                        {org.owner?.email ?? ""}
                      </span>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant="outline" className="uppercase">
                        {org.subscription?.plan ?? "FREE"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={suspended ? "destructive" : "default"}>
                        {suspended ? "Suspended" : "Active"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant={suspended ? "outline" : "destructive"}
                        size="sm"
                        disabled={pendingId !== null}
                        onClick={() =>
                          handleToggle(
                            org.id,
                            org.name,
                            suspended ? "ACTIVE" : "SUSPENDED",
                          )
                        }
                      >
                        {pendingId === org.id ? (
                          <Spinner />
                        ) : suspended ? (
                          "Reactivate"
                        ) : (
                          "Suspend"
                        )}
                      </Button>
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
