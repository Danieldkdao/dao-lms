import { db } from "@/db/db";
import { LessonTable } from "@/db/schema";
import { revalidateCourseCache } from "@/features/courses/db/cache/courses";

export const insertLesson = async (
  courseId: string,
  data: typeof LessonTable.$inferInsert,
) => {
  await db.insert(LessonTable).values(data).returning();

  revalidateCourseCache(courseId);
};
