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

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface MeMembership {
  role: OrgRole;
  organization: {
    id: string;
    name: string;
    slug: string;
    status: string;
  };
}

export interface MeUser extends User {
  memberships: MeMembership[];
}
