export type SidebarIcon =
  | "dashboard"
  | "activity"
  | "payments"
  | "profile"
  | "workspaces"
  | "admin"
  | "users"
  | "orgs"
  | "logs"
  | "overview"
  | "people"
  | "projects"
  | "tasks"
  | "sprints"
  | "back";

export interface SidebarItem {
  title: string;
  url: string;
  exact?: boolean;
  icon?: SidebarIcon;
}

export interface SidebarGroup {
  title: string;
  items: SidebarItem[];
}

export type SidebarItems = SidebarGroup[];
