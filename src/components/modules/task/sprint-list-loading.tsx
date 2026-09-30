import { Skeleton } from "@/components/ui/skeleton";

export default function SprintListLoading() {
  return (
    <div className="flex flex-col gap-4" aria-label="Loading sprints">
      <div className="flex justify-between">
        <div className="flex gap-2">
          <Skeleton className="h-8 w-52" />
          <Skeleton className="h-8 w-36" />
        </div>
        <Skeleton className="h-8 w-28" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-48" />
        ))}
      </div>
    </div>
  );
}
