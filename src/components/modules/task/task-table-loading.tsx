import { Skeleton } from "@/components/ui/skeleton";

export default function TaskTableLoading() {
  return (
    <div className="flex flex-col gap-4" aria-label="Loading tasks">
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-8 w-36" />
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-8 w-44" />
      </div>
      <div className="overflow-hidden rounded-xl border">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-12 rounded-none border-b" />
        ))}
      </div>
    </div>
  );
}
