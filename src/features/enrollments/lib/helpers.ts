import { db } from "@/db/db";
import { EnrollmentTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export const userHasCourse = async (userId: string, courseId: string) => {
  const result = await db
    .select({ id: EnrollmentTable.id })
    .from(EnrollmentTable)
    .where(
      and(
        eq(EnrollmentTable.userId, userId),
        eq(EnrollmentTable.courseId, courseId),
      ),
    );

  return result.length > 0;
};
