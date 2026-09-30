import { Skeleton } from "@/components/ui/skeleton";

export default function TaskCalendarLoading() {
  return (
    <div className="flex flex-col gap-4" aria-label="Loading calendar">
      <div className="flex items-center justify-between">
        <Skeleton className="h-7 w-40" />
        <div className="flex gap-1">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
      <Skeleton className="h-96 w-full" />
    </div>
  );
}
