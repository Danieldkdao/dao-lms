import { db } from "@/db/db";
import { ChapterTable } from "@/db/schema";
import { revalidateCourseCache } from "@/features/courses/db/cache/courses";
import { eq } from "drizzle-orm";

export const insertChapter = async (data: typeof ChapterTable.$inferInsert) => {
  const [insertedChapter] = await db
    .insert(ChapterTable)
    .values(data)
    .returning();

  revalidateCourseCache(insertedChapter.courseId);
};

export const updateChapter = async (
  chapterId: string,
  data: Partial<typeof ChapterTable.$inferSelect>,
) => {
  const [updatedChapter] = await db
    .update(ChapterTable)
    .set(data)
    .where(eq(ChapterTable.id, chapterId))
    .returning();

  revalidateCourseCache(updatedChapter.courseId);
};
