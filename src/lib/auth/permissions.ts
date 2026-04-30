"use server";

import { headers } from "next/headers";
import { auth } from "./auth";
import { db } from "@/db/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

export const requireAdminPermission = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session)
    return {
      result: false,
      data: null,
    };

  const [existingUser] = await db
    .select()
    .from(user)
    .where(eq(user.id, session.user.id));
  if (!existingUser) {
    return {
      result: false,
      data: null,
    };
  }

  return {
    result: existingUser.role === "admin",
    data: existingUser,
  };
};
