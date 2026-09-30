import { Skeleton } from "@/components/ui/skeleton";

export default function OrganizationListLoading() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[
        "org-skeleton-1",
        "org-skeleton-2",
        "org-skeleton-3",
        "org-skeleton-4",
        "org-skeleton-5",
        "org-skeleton-6",
      ].map((id) => (
        <div key={id} className="flex flex-col gap-3 rounded-xl border p-5">
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-lg" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>
          <div className="flex gap-4">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-8 w-full" />
        </div>
      ))}
    </div>
  );
}
