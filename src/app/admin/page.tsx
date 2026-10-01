import type { Metadata } from "next";
import { Suspense } from "react";
import AdminOverview, {
  AdminOverviewSkeleton,
} from "@/components/modules/admin/admin-overview";

export const metadata: Metadata = {
  title: "Admin Overview — TaskFlow",
  description:
    "Platform totals, subscription mix, payment outcomes, and role split.",
};

export default function AdminPage() {
  return (
    <Suspense fallback={<AdminOverviewSkeleton />}>
      <AdminOverview />
    </Suspense>
  );
}
