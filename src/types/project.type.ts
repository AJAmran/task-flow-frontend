import type { ListParams } from "./organization.type";
import type { OrgRole, User } from "./user.type";

export type ProjectStatus = "ACTIVE" | "ARCHIVED";

export type ProjectSortBy = "createdAt" | "updatedAt" | "name";

export interface CreateProjectPayload {
  name: string;
  description?: string;
  teamId?: string;
  startDate?: string;
  endDate?: string;
}

export interface UpdateProjectPayload {
  name?: string;
  description?: string | null;
  status?: ProjectStatus;
  teamId?: string | null;
  startDate?: string | null;
  endDate?: string | null;
}

export interface AddProjectMemberPayload {
  userId: string;
}

export interface ProjectListParams extends ListParams {
  status?: ProjectStatus;
  teamId?: string;
  search?: string;
  sortBy?: ProjectSortBy;
  sortOrder?: "asc" | "desc";
}

export interface ProjectTeamRef {
  id: string;
  name: string;
}

export interface ProjectCounts {
  members: number;
  sprints: number;
  tasks: number;
}

export interface Project {
  id: string;
  organizationId: string;
  teamId: string | null;
  name: string;
  description: string | null;
  status: ProjectStatus;
  startDate?: string | null;
  endDate?: string | null;
  createdAt: string;
  updatedAt: string;
  team?: ProjectTeamRef | null;
  _count?: ProjectCounts;
}

export interface ProjectMemberItem {
  id: string;
  projectId: string;
  userId: string;
  role: OrgRole;
  user: Pick<
    User,
    "id" | "name" | "email" | "profileImage" | "platformRole" | "isActive"
  >;
}

export interface ProjectDetail extends Project {
  members: ProjectMemberItem[];
}
