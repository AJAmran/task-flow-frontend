import { Skeleton } from "@/components/ui/skeleton";

export default function ActivityFeedLoading() {
  return (
    <div className="flex flex-col gap-3" aria-label="Loading activity">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-24 w-full" />
      ))}
    </div>
  );
}
