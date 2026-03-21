export type AppRole = "admin" | "trainer" | "employee";

export function hasRole(userRole: AppRole, allowedRoles: AppRole[]) {
  return allowedRoles.includes(userRole);
}

export function isAdmin(role: AppRole) {
  return role === "admin";
}

export function isTrainer(role: AppRole) {
  return role === "trainer";
}

export function isEmployee(role: AppRole) {
  return role === "employee";
}