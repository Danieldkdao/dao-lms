import { db } from "@/db/db";
import { CourseTable } from "@/db/schema";
import { revalidateCourseCache } from "./cache/courses";
import { eq } from "drizzle-orm";

export const insertCourse = async (data: typeof CourseTable.$inferInsert) => {
  const [insertedCourse] = await db
    .insert(CourseTable)
    .values(data)
    .returning();

  revalidateCourseCache(insertedCourse.id);
};

export const updateCourse = async (
  courseId: string,
  data: Partial<typeof CourseTable.$inferSelect>,
) => {
  const [updatedCourse] = await db
    .update(CourseTable)
    .set(data)
    .where(eq(CourseTable.id, courseId))
    .returning();

  revalidateCourseCache(updatedCourse.id);
};

export const deleteCourse = async (courseId: string) => {
  const [deletedCourse] = await db
    .delete(CourseTable)
    .where(eq(CourseTable.id, courseId))
    .returning();

  revalidateCourseCache(deletedCourse.id);

  return deletedCourse;
};
