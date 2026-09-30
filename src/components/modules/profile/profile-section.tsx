"use client";

import { ShieldCheck, User } from "lucide-react";
import AvatarInitials from "@/components/ui/avatar-initials";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyProfile } from "@/hooks";
import ChangePasswordForm from "@/components/form/change-password-form";
import UpdateProfileForm from "@/components/form/update-profile-form";

export function ProfileSectionSkeleton() {
  return (
    <div className="flex flex-col gap-4" aria-label="Loading profile">
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

export default function ProfileSection() {
  const { data, isPending, isError, refetch } = useMyProfile();

  if (isPending) {
    return <ProfileSectionSkeleton />;
  }

  if (isError || !data?.data) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border p-10 text-center">
        <p className="font-medium">Could not load profile</p>
        <Button variant="outline" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  const user = data.data;
  const isAdmin = user.platformRole === "SUPER_ADMIN";

  return (
    <div className="flex flex-col gap-4">
      <Card className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal-500 via-cyan-400 to-teal-500"
        />
        <CardHeader>
          <div className="flex flex-wrap items-center gap-3">
            <AvatarInitials name={user.name} size="lg" />
            <div className="min-w-0">
              <CardTitle className="truncate text-xl">{user.name}</CardTitle>
              <CardDescription className="truncate">
                {user.email}
              </CardDescription>
            </div>
            <span className="ml-auto flex items-center gap-2">
              <Badge variant={isAdmin ? "default" : "secondary"}>
                {isAdmin ? (
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="size-3" /> Admin
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <User className="size-3" /> Member
                  </span>
                )}
              </Badge>
              {user.isEmailVerified ? (
                <Badge variant="outline">Verified</Badge>
              ) : (
                <Badge variant="outline">Unverified</Badge>
              )}
            </span>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Personal details</CardTitle>
            <CardDescription>
              Name and avatar shown across teams and tasks.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UpdateProfileForm
              currentName={user.name}
              currentImage={user.profileImage}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Password</CardTitle>
            <CardDescription>
              {user.provider === "google"
                ? "This account signs in with Google."
                : "Choose a strong, unique password."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChangePasswordForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
