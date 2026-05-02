import { db } from "@/db/db";
import { LessonTable } from "@/db/schema";
import { revalidateCourseCache } from "@/features/courses/db/cache/courses";
import { revalidateLessonCache } from "./cache/lessons";
import { eq } from "drizzle-orm";

export const insertLesson = async (
  courseId: string,
  data: typeof LessonTable.$inferInsert,
) => {
  const [insertedLesson] = await db
    .insert(LessonTable)
    .values(data)
    .returning();

  revalidateCourseCache(courseId);
  revalidateLessonCache(insertedLesson.id);
};

export const updateLesson = async (
  courseId: string,
  lessonId: string,
  data: Partial<typeof LessonTable.$inferSelect>,
) => {
  const [updatedLesson] = await db
    .update(LessonTable)
    .set(data)
    .where(eq(LessonTable.id, lessonId))
    .returning();

  revalidateCourseCache(courseId);
  revalidateLessonCache(updatedLesson.id);
};
