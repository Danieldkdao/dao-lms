import { db } from "@/db/db";
import { LessonTable } from "@/db/schema";
import { revalidateCourseCache } from "@/features/courses/db/cache/courses";
import { revalidateLessonCache } from "./cache/lessons";
import { eq, sql } from "drizzle-orm";

export const insertLesson = async (
  courseId: string,
  data: typeof LessonTable.$inferInsert,
) => {
  const [nextPosition] = await db
    .select({
      position: sql<number>`coalesce(max(${LessonTable.position}), 0) + 1`,
    })
    .from(LessonTable)
    .where(eq(LessonTable.chapterId, data.chapterId));

  const [insertedLesson] = await db
    .insert(LessonTable)
    .values({
      ...data,
      position: nextPosition.position,
    })
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
