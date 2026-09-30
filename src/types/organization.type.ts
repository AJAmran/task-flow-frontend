import type { OrgRole, User } from "./user.type";

export type OrganizationStatus = "ACTIVE" | "SUSPENDED";

export interface AcceptInvitationPayload {
  token: string;
}

export interface CreateOrganizationPayload {
  name: string;
  slug?: string;
}

export interface UpdateOrganizationPayload {
  name?: string;
  slug?: string;
}

export interface InviteMemberPayload {
  email: string;
  role?: OrgRole;
}

export interface UpdateMemberRolePayload {
  role: OrgRole;
}

export interface CreateTeamPayload {
  name: string;
}

export interface UpdateTeamPayload {
  name?: string;
}

export interface AddTeamMemberPayload {
  userId: string;
}

export interface ListParams {
  page?: number;
  limit?: number;
}

export interface OrgSubscription {
  id: string;
  plan: string;
  status: string;
  maxProjects: number;
  maxMembers: number;
}

export interface OrgCounts {
  members: number;
  projects: number;
  teams?: number;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  ownerUserId: string;
  status: OrganizationStatus;
  createdAt: string;
  updatedAt: string;
  subscription?: OrgSubscription | null;
  _count?: OrgCounts;
}

export interface MembershipItem {
  membershipId: string;
  role: OrgRole;
  joinedAt: string | null;
  organization: Organization;
}

export interface CreateOrganizationResponse {
  organization: Organization;
  subscription: OrgSubscription;
  membership: {
    id: string;
    role: OrgRole;
  };
}

export interface OrganizationOwner {
  id: string;
  name: string;
  email: string;
}

export interface OrganizationDetail extends Organization {
  owner?: OrganizationOwner | null;
  subscription?: OrgSubscription | null;
  _count?: OrgCounts & { teams: number; projects: number; members: number };
}

export interface OrganizationDetailResponse {
  organization: OrganizationDetail;
  myRole: OrgRole;
}

export interface OrganizationMember {
  id: string;
  organizationId: string;
  userId: string;
  role: OrgRole;
  invitedAt: string;
  joinedAt: string | null;
  user: Pick<
    User,
    "id" | "name" | "email" | "profileImage" | "platformRole" | "isActive"
  >;
}

export interface OrganizationInvitation {
  id: string;
  organizationId: string;
  email: string;
  role: OrgRole;
  token: string;
  expiresAt: string;
  acceptedAt: string | null;
}

export interface Team {
  id: string;
  organizationId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  user?: Pick<User, "id" | "name" | "email" | "profileImage"> | null;
}
