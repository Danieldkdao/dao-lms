import { UserRole } from "@/db/schema";

export const isAdminRole = (role?: UserRole | null) => {
  return role === "admin";
};

export const getDashboardHref = (role?: string | null) => {
  if (!role) return "/sign-in";

  return role === "admin" ? "/admin" : "/dashboard";
};
