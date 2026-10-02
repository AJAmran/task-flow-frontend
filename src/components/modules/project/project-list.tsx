"use client";

import { Archive, FolderKanban, Plus, SearchX } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TablePagination from "@/components/ui/table-pagination";
import { useProjects, useTeams } from "@/hooks";
import useDebounce from "@/hooks/debounce.hook";
import type { ProjectSortBy, ProjectStatus } from "@/types";
import ProjectListLoading from "./project-list-loading";

const PAGE_SIZE = 9;

const sortOptions: {
  value: `${ProjectSortBy}:${"asc" | "desc"}`;
  label: string;
}[] = [
  { value: "createdAt:desc", label: "Newest first" },
  { value: "createdAt:asc", label: "Oldest first" },
  { value: "updatedAt:desc", label: "Recently updated" },
  { value: "name:asc", label: "Name (A–Z)" },
  { value: "name:desc", label: "Name (Z–A)" },
];

const isValidSort = (by: string, order: string): boolean =>
  sortOptions.some((opt) => opt.value === `${by}:${order}`);

export default function ProjectList({
  organizationId,
}: {
  organizationId: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pageParam = Number(searchParams.get("page") ?? "1");
  const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
  const statusParam = searchParams.get("status") as ProjectStatus | null;
  const status =
    statusParam === "ACTIVE" || statusParam === "ARCHIVED"
      ? statusParam
      : undefined;
  const teamId = searchParams.get("teamId") ?? undefined;
  const sortBy = (searchParams.get("sortBy") as ProjectSortBy) || "createdAt";
  const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc";
  const sortValue = isValidSort(sortBy, sortOrder)
    ? (`${sortBy}:${sortOrder}` as const)
    : ("createdAt:desc" as const);
  const urlSearch = searchParams.get("search") ?? "";

  const [searchInput, setSearchInput] = useState(urlSearch);
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

  const { data, isPending, isError, refetch } = useProjects(organizationId, {
    page,
    limit: PAGE_SIZE,
    ...(status && { status }),
    ...(teamId && { teamId }),
    sortBy: sortValue.split(":")[0] as ProjectSortBy,
    sortOrder: sortValue.split(":")[1] as "asc" | "desc",
  });
  const { data: teamsData } = useTeams(organizationId, {
    page: 1,
    limit: 100,
  });
  const teams = teamsData?.data ?? [];

  const projects = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 0;

  const visible = debouncedSearch.trim().toLowerCase()
    ? projects.filter(
        (p) =>
          p.name.toLowerCase().includes(debouncedSearch.trim().toLowerCase()) ||
          p.description
            ?.toLowerCase()
            .includes(debouncedSearch.trim().toLowerCase()),
      )
    : projects;

  if (isPending) {
    return <ProjectListLoading />;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border p-10 text-center">
        <p className="font-medium">Could not load projects</p>
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
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
        <Input
          type="search"
          placeholder="Search projects..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="lg:max-w-xs"
          aria-label="Search projects"
        />
        <div className="flex flex-wrap gap-2">
          <Select
            value={status ?? "ALL"}
            onValueChange={(val: string | null) =>
              setParam("status", val === "ALL" ? undefined : (val ?? undefined))
            }
          >
            <SelectTrigger className="w-32" aria-label="Filter by status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All status</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="ARCHIVED">Archived</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={teamId ?? "ALL"}
            onValueChange={(val: string | null) =>
              setParam("teamId", val === "ALL" ? undefined : (val ?? undefined))
            }
          >
            <SelectTrigger className="w-36" aria-label="Filter by team">
              <SelectValue placeholder="All teams" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All teams</SelectItem>
              {teams.map((team) => (
                <SelectItem key={team.id} value={team.id}>
                  {team.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={sortValue}
            onValueChange={(val: string | null) => {
              const [by, order] = (val ?? "createdAt:desc").split(":");
              const params = new URLSearchParams(searchParams.toString());
              params.set("sortBy", by);
              params.set("sortOrder", order);
              params.delete("page");
              const query = params.toString();
              router.push(query ? `${pathname}?${query}` : pathname, {
                scroll: false,
              });
            }}
          >
            <SelectTrigger className="w-44" aria-label="Sort projects">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border px-6 py-12 text-center">
          <span className="rounded-full bg-muted p-3">
            {status === "ARCHIVED" ? (
              <Archive className="size-5 text-muted-foreground" />
            ) : debouncedSearch || projects.length > 0 ? (
              <SearchX className="size-5 text-muted-foreground" />
            ) : (
              <FolderKanban className="size-5 text-muted-foreground" />
            )}
          </span>
          <p className="font-medium">
            {projects.length === 0 && !debouncedSearch
              ? "No projects yet"
              : `No results${debouncedSearch ? ` for "${debouncedSearch}"` : ""}`}
          </p>
          <p className="max-w-sm text-sm text-muted-foreground">
            {projects.length === 0 && !debouncedSearch
              ? "Create your first project to start planning sprints and tasks."
              : "Try different filters."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((project) => (
            <Card
              key={project.id}
              className="flex flex-col transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <span className="flex size-10 items-center justify-center rounded-lg bg-teal-600/10 text-teal-700">
                    <FolderKanban className="size-5" />
                  </span>
                  <Badge
                    variant={
                      project.status === "ACTIVE" ? "default" : "secondary"
                    }
                  >
                    {project.status === "ACTIVE" ? "Active" : "Archived"}
                  </Badge>
                </div>
                <CardTitle className="line-clamp-1">{project.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {project.description ||
                    project.team?.name ||
                    "No description"}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex gap-4 text-sm text-muted-foreground">
                <span>{project._count?.tasks ?? 0} tasks</span>
                <span>{project._count?.sprints ?? 0} sprints</span>
                <span>{project._count?.members ?? 0} members</span>
              </CardContent>
              <CardFooter className="mt-auto">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  render={
                    <Link
                      href={`/organizations/${organizationId}/projects/${project.id}/tasks?view=board`}
                    >
                      Open board
                    </Link>
                  }
                >
                  Open board
                </Button>
              </CardFooter>
            </Card>
          ))}
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

      <div className="flex justify-center">
        <Button
          variant="outline"
          render={
            <Link href={`/organizations/${organizationId}/projects/new`}>
              <Plus /> New project
            </Link>
          }
        >
          <Plus /> New project
        </Button>
      </div>
    </div>
  );
}
