import { Skeleton } from "@/components/ui/skeleton";

export default function TaskDetailLoading() {
  return (
    <div className="flex flex-col gap-4" aria-label="Loading task">
      <Skeleton className="h-7 w-64" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-8 w-36" />
        <Skeleton className="h-8 w-48" />
      </div>
      <Skeleton className="h-44 w-full" />
      <Skeleton className="h-44 w-full" />
      <Skeleton className="h-36 w-full" />
    </div>
  );
}
