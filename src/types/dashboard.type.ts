export interface StatusCount {
  status: string;
  count: number;
}

export interface DashboardCounts {
  projects: number;
  members: number;
  teams: number;
  sprints: number;
  tasks: number;
}

export interface RecentProject {
  id: string;
  name: string;
  status: string;
  taskCount: number;
  updatedAt: string;
}

export interface OrgDashboard {
  organization: {
    id: string;
    name: string;
    slug: string;
    status: string;
  };
  counts: DashboardCounts;
  projectsByStatus: StatusCount[];
  sprintsByStatus: StatusCount[];
  tasksByStatus: StatusCount[];
  overdueTasks: number;
  recentProjects: RecentProject[];
  cached?: boolean;
}
