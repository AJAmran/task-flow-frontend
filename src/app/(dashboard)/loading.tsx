import { Spinner } from "@/components/ui/spinner";

export default function DashboardLoading() {
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Spinner /> Loading...
      </div>
    </div>
  );
}
