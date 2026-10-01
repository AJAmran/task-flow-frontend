import type { ListParams } from "./organization.type";
import type { PlatformRole } from "./user.type";

export type AdminOrgStatus = "ACTIVE" | "SUSPENDED";

export interface AdminOrgListParams extends ListParams {
  status?: AdminOrgStatus;
}

export interface AdminUserListParams extends ListParams {
  search?: string;
  platformRole?: PlatformRole;
  isActive?: boolean;
}

export interface AuditLogParams extends ListParams {
  action?: string;
  userId?: string;
  from?: string;
  to?: string;
}

export interface AdminOrgOwner {
  id: string;
  name: string;
  email: string;
}

export interface AdminOrganization {
  id: string;
  name: string;
  slug: string;
  status: AdminOrgStatus;
  createdAt: string;
  updatedAt: string;
  owner: AdminOrgOwner | null;
  subscription: {
    id: string;
    plan: string;
    status: string;
  } | null;
  _count: {
    members: number;
    projects: number;
  };
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  provider: string;
  profileImage: string | null;
  platformRole: PlatformRole;
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string;
  _count: {
    memberships: number;
  };
}

export interface AdminStatusCount {
  status: string;
  count: number;
}

export interface AdminDashboardStats {
  totals: {
    organizations: number;
    users: number;
    activeSubscriptions: number;
    revenueBDT: number;
  };
  organizationsByStatus: AdminStatusCount[];
  usersByRole: { role: string; count: number }[];
  subscriptionsByPlan: { plan: string; count: number }[];
  paymentsByStatus: AdminStatusCount[];
}

export interface AuditLog {
  id: string;
  action: string;
  meta: Record<string, unknown> | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  task: {
    id: string;
    title: string;
  } | null;
}
