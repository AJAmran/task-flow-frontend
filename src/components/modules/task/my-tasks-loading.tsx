import { Skeleton } from "@/components/ui/skeleton";

export default function MyTasksLoading() {
  return (
    <div className="flex flex-col gap-2" aria-label="Loading your tasks">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-16 w-full" />
      ))}
    </div>
  );
}
