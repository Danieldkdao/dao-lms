import { UserRole } from "@/db/schema";

export const isAdminRole = (role: UserRole) => {
  return role === "admin";
};
