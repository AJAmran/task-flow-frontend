import { Skeleton } from "@/components/ui/skeleton";
import { taskStatuses } from "./task-shared";

export default function TaskBoardLoading() {
  return (
    <div className="flex flex-col gap-4" aria-label="Loading board">
      <div className="flex justify-between">
        <Skeleton className="h-8 w-52" />
        <Skeleton className="h-8 w-28" />
      </div>
      <div className="grid items-start gap-4 md:grid-cols-2 xl:grid-cols-4">
        {taskStatuses.map((status) => (
          <div
            key={status}
            className="flex flex-col gap-2 rounded-xl bg-muted/50 p-2"
          >
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
          </div>
        ))}
      </div>
    </div>
  );
}
