const menuItems = [
  { label: "Dashboard", href: "/dashboard", roles: ["admin", "trainer", "employee"] },
  { label: "Training Sessions", href: "/dashboard/sessions", roles: ["admin", "trainer"] },
  { label: "Materials", href: "/dashboard/materials", roles: ["admin", "trainer", "employee"] },
  { label: "Assignments", href: "/dashboard/assignments", roles: ["admin", "trainer", "employee"] },
  { label: "Users", href: "/dashboard/users", roles: ["admin"] },
  { label: "Attendance", href: "/dashboard/attendance", roles: ["admin", "trainer"] },
  { label: "Notifications", href: "/dashboard/notifications", roles: ["admin", "trainer", "employee"] },
  { label: "Reports", href: "/dashboard/reports", roles: ["admin", "trainer"] },
  { label: "Settings", href: "/settings/profile", roles: ["admin", "trainer", "employee"] },
];