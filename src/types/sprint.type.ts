import type { ListParams } from "./organization.type";

export type SprintStatus = "PLANNED" | "ACTIVE" | "COMPLETED";

export interface CreateSprintPayload {
  name: string;
  startDate: string;
  endDate: string;
}

export interface UpdateSprintPayload {
  name?: string;
  startDate?: string;
  endDate?: string;
}

export interface SprintListParams extends ListParams {
  status?: SprintStatus;
}

export interface Sprint {
  id: string;
  projectId: string;
  name: string;
  startDate: string;
  endDate: string;
  status: SprintStatus;
  createdAt: string;
  updatedAt: string;
  _count?: {
    tasks: number;
  };
}
