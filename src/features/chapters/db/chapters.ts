import { db } from "@/db/db";
import { ChapterTable } from "@/db/schema";
import { revalidateCourseCache } from "@/features/courses/db/cache/courses";

export const insertChapter = async (data: typeof ChapterTable.$inferInsert) => {
  const [insertedChapter] = await db
    .insert(ChapterTable)
    .values(data)
    .returning();

  revalidateCourseCache(insertedChapter.courseId);
};
