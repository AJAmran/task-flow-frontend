import { Skeleton } from "@/components/ui/skeleton";

export default function TeamSectionLoading() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {[
        "team-skeleton-1",
        "team-skeleton-2",
        "team-skeleton-3",
        "team-skeleton-4",
      ].map((id) => (
        <div key={id} className="flex flex-col gap-3 rounded-xl border p-5">
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-3 w-1/3" />
          <div className="flex gap-2">
            <Skeleton className="h-8 flex-1" />
            <Skeleton className="h-8 flex-1" />
          </div>
        </div>
      ))}
    </div>
  );
}
