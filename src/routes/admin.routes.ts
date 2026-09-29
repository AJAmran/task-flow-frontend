const prefix = "/admin";

export const adminRoutes = [
  {
    title: "Management",
    items: [
      {
        title: "Overview",
        url: `${prefix}`,
      },
      {
        title: "Users",
        url: `${prefix}/users`,
      },
      {
        title: "Organizations",
        url: `${prefix}/organizations`,
      },
      {
        title: "Audit Logs",
        url: `${prefix}/audit-logs`,
      },
    ],
  },
];
