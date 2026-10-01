"use client";

import { format } from "date-fns";
import { ScrollText, SearchX } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TablePagination from "@/components/ui/table-pagination";
import { useAuditLogs } from "@/hooks";
import useDebounce from "@/hooks/debounce.hook";

const PAGE_SIZE = 15;

export function AuditLogsSkeleton() {
  return (
    <div className="flex flex-col gap-4" aria-label="Loading audit logs">
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-8 w-36" />
        <Skeleton className="h-8 w-36" />
      </div>
      <Skeleton className="h-80 w-full" />
    </div>
  );
}

export default function AuditLogsTable() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pageParam = Number(searchParams.get("page") ?? "1");
  const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
  const urlAction = searchParams.get("action") ?? "";
  const from = searchParams.get("from") ?? undefined;
  const to = searchParams.get("to") ?? undefined;

  const [actionInput, setActionInput] = useState(urlAction);
  const debouncedAction = useDebounce(actionInput);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const current = params.get("action") ?? "";
    if (debouncedAction.trim() === current) {
      return;
    }
    if (debouncedAction.trim()) {
      params.set("action", debouncedAction.trim());
    } else {
      params.delete("action");
    }
    params.delete("page");
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [debouncedAction, pathname, router, searchParams]);

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

  const { data, isPending, isError, refetch } = useAuditLogs({
    page,
    limit: PAGE_SIZE,
    ...(debouncedAction.trim() && { action: debouncedAction.trim() }),
    ...(from && { from: new Date(`${from}T00:00:00`).toISOString() }),
    ...(to && { to: new Date(`${to}T23:59:59`).toISOString() }),
  });

  const logs = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 0;
  const total = data?.meta?.total ?? 0;

  if (isPending) {
    return <AuditLogsSkeleton />;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border p-10 text-center">
        <p className="font-medium">Could not load audit logs</p>
        <Button variant="outline" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Input
          type="search"
          placeholder="Filter by action, e.g. TASK_CREATED"
          value={actionInput}
          onChange={(e) => setActionInput(e.target.value)}
          className="sm:max-w-56"
          aria-label="Filter by action"
        />
        <Input
          type="date"
          defaultValue={from ?? ""}
          onChange={(e) => setParam("from", e.target.value || undefined)}
          className="w-auto"
          aria-label="From date"
        />
        <Input
          type="date"
          defaultValue={to ?? ""}
          onChange={(e) => setParam("to", e.target.value || undefined)}
          className="w-auto"
          aria-label="To date"
        />
        <p className="ml-auto text-sm text-muted-foreground">
          {total} event{total === 1 ? "" : "s"}
        </p>
      </div>

      {logs.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed px-6 py-12 text-center">
          <span className="rounded-full bg-muted p-3">
            <ScrollText className="size-5 text-muted-foreground" />
          </span>
          <p className="font-medium">No audit events match</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Actions like task updates, invites, billing, and blocks appear
            here.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Action</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead className="hidden md:table-cell">Task</TableHead>
                <TableHead className="hidden sm:table-cell">When</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-[11px]">
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="block max-w-44 truncate text-sm font-medium">
                      {log.user.name}
                    </span>
                    <span className="block max-w-44 truncate text-xs text-muted-foreground">
                      {log.user.email}
                    </span>
                  </TableCell>
                  <TableCell className="hidden max-w-48 truncate text-sm text-muted-foreground md:table-cell">
                    {log.task?.title ?? "—"}
                  </TableCell>
                  <TableCell className="hidden whitespace-nowrap text-sm text-muted-foreground sm:table-cell">
                    {format(new Date(log.createdAt), "MMM d, yyyy HH:mm")}
                  </TableCell>
                </TableRow>
              ))}
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
