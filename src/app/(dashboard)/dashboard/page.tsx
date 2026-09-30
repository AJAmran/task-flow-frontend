import type { Metadata } from "next";
import { Suspense } from "react";
import DashboardHome, {
  DashboardHomeLoading,
} from "@/components/modules/dashboard/dashboard-home";

export const metadata: Metadata = {
  title: "Dashboard — TaskFlow",
  description:
    "Your TaskFlow home. See workspaces, continue where you left off, and jump into teams and projects.",
};

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardHomeLoading />}>
      <DashboardHome />
    </Suspense>
  );
}
