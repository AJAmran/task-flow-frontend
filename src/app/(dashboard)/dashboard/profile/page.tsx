import type { Metadata } from "next";
import { Suspense } from "react";
import ProfileSection, {
  ProfileSectionSkeleton,
} from "@/components/modules/profile/profile-section";

export const metadata: Metadata = {
  title: "Profile & Settings — TaskFlow",
  description:
    "Update your name and avatar, and change your password securely.",
};

export default function ProfilePage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">
          Profile & settings
        </h1>
        <p className="text-sm text-muted-foreground">
          How you appear to teammates, plus account security.
        </p>
      </div>
      <Suspense fallback={<ProfileSectionSkeleton />}>
        <ProfileSection />
      </Suspense>
    </div>
  );
}
