export type PlatformRole = "USER" | "SUPER_ADMIN";

export type OrgRole = "ORG_OWNER" | "MEMBER";

export type UserRole = PlatformRole | OrgRole;

export interface User {
  id: string;
  name: string;
  email: string;
  provider: string;
  googleId: string | null;
  profileImage: string | null;
  platformRole: PlatformRole;
  isActive: boolean;
  isEmailVerified: boolean;
  emailVerifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
