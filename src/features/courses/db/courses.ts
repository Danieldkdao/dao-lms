import { db } from "@/db/db";
import { CourseTable } from "@/db/schema";
import { revalidateCourseCache } from "./cache/courses";

export const insertCourse = async (data: typeof CourseTable.$inferInsert) => {
  const [insertedCourse] = await db
    .insert(CourseTable)
    .values(data)
    .returning();

  revalidateCourseCache(insertedCourse.id);
};
