import {
  BarChart3,
  CalendarDays,
  KanbanSquare,
  ShieldCheck,
  Users,
  Wallet,
} from "lucide-react";

export const homeFeatures = [
  {
    icon: KanbanSquare,
    title: "Kanban boards",
    description:
      "Drag tasks across Todo, In Progress, In Review, and Done with live status updates.",
  },
  {
    icon: CalendarDays,
    title: "Sprint planning",
    description:
      "Time-box work into planned, active, and completed sprints with start and end dates.",
  },
  {
    icon: Users,
    title: "Organizations & teams",
    description:
      "Invite members, group them into teams, and assign them to projects in seconds.",
  },
  {
    icon: ShieldCheck,
    title: "Role-based access",
    description:
      "Super Admins, Org Owners, and Members each get a dashboard built for their job.",
  },
  {
    icon: BarChart3,
    title: "Activity & analytics",
    description:
      "Project activity feeds and dashboards show who did what, and what is next.",
  },
  {
    icon: Wallet,
    title: "Pro billing with bKash",
    description:
      "Upgrade organizations to Pro or Team plans with real bKash sandbox payments.",
  },
];
