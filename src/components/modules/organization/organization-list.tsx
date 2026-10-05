"use client";

import { Building2, Crown, SearchX, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import TablePagination from "@/components/ui/table-pagination";
import { useOrganizations } from "@/hooks";
import useDebounce from "@/hooks/debounce.hook";
import { cn } from "@/lib/utils";
import OrganizationListLoading from "./organization-list-loading";

const PAGE_SIZE = 9;

export default function OrganizationList() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pageParam = Number(searchParams.get("page") ?? "1");
  const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
  const urlSearch = searchParams.get("search") ?? "";

  const [searchInput, setSearchInput] = useState(urlSearch);

  useEffect(() => {
    setSearchInput((prev) => (prev === urlSearch ? prev : urlSearch));
  }, [urlSearch]);
  const debouncedSearch = useDebounce(searchInput);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const current = params.get("search") ?? "";
    if (debouncedSearch === current) {
      return;
    }
    if (debouncedSearch) {
      params.set("search", debouncedSearch);
    } else {
      params.delete("search");
    }
    params.delete("page");
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [debouncedSearch, pathname, router, searchParams]);

  const { data, isPending, isError, refetch } = useOrganizations({
    page,
    limit: PAGE_SIZE,
    ...(debouncedSearch.trim() && { search: debouncedSearch.trim() }),
  });

  const setParams = (next: { page?: number; search?: string }) => {
    const params = new URLSearchParams(searchParams.toString());
    if (next.page !== undefined) {
      if (next.page <= 1) {
        params.delete("page");
      } else {
        params.set("page", String(next.page));
      }
    }
    if (next.search !== undefined) {
      if (next.search) {
        params.set("search", next.search);
      } else {
        params.delete("search");
      }
    }
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const memberships = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 0;

  const visible = memberships;

  if (isPending) {
    return <OrganizationListLoading />;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border p-10 text-center">
        <p className="font-medium">Could not load organizations</p>
        <p className="text-sm text-muted-foreground">
          Check your connection and try again.
        </p>
        <Button variant="outline" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Input
          type="search"
          placeholder="Filter by name..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="sm:max-w-xs"
          aria-label="Filter organizations by name"
        />
        <p className="text-sm text-muted-foreground">
          {data?.meta?.total ?? 0} organization
          {(data?.meta?.total ?? 0) === 1 ? "" : "s"}
        </p>
      </div>

      {visible.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border px-6 py-12 text-center">
          <span className="rounded-full bg-muted p-3">
            <SearchX className="size-5 text-muted-foreground" />
          </span>
          <p className="font-medium">
            {memberships.length === 0
              ? "No organizations yet"
              : `No results for "${debouncedSearch}"`}
          </p>
          <p className="max-w-sm text-sm text-muted-foreground">
            {memberships.length === 0
              ? "Create your first workspace to invite your team and start shipping."
              : "Try a different name."}
          </p>
          {memberships.length === 0 && (
            <Button
              className="mt-2"
              nativeButton={false}
              render={
                <Link href="/organizations/new">Create workspace</Link>
              }
            >
              Create workspace
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((membership) => {
            const org = membership.organization;
            const isOwner = membership.role === "ORG_OWNER";

            return (
              <Card key={membership.membershipId} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <span className="flex size-10 items-center justify-center rounded-lg bg-muted">
                      <Building2 className="size-5" />
                    </span>
                    <Badge
                      variant={isOwner ? "default" : "secondary"}
                      className={cn("gap-1")}
                    >
                      {isOwner ? (
                        <Crown className="size-3" />
                      ) : (
                        <User className="size-3" />
                      )}
                      {isOwner ? "Owner" : "Member"}
                    </Badge>
                  </div>
                  <CardTitle className="line-clamp-1">{org.name}</CardTitle>
                  <CardDescription className="font-mono text-xs">
                    /{org.slug}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex gap-4 text-sm text-muted-foreground">
                  <span>{org._count?.members ?? 0} members</span>
                  <span>{org._count?.projects ?? 0} projects</span>
                  {org.subscription && (
                    <span className="uppercase">{org.subscription.plan}</span>
                  )}
                </CardContent>
                <CardFooter className="mt-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    nativeButton={false}
                    render={<Link href={`/organizations/${org.id}`}>Open</Link>}
                  >
                    Open
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <TablePagination
          page={page}
          totalPages={totalPages}
          handlePageChange={(next) =>
            setParams({ page: typeof next === "function" ? next(page) : next })
          }
        />
      )}
    </div>
  );
}
