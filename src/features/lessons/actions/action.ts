"use server";

import { requireAdminPermission } from "@/lib/auth/permissions";
import {
  createLessonSchema,
  CreateLessonSchemaType,
  lessonSchema,
  LessonSchemaType,
} from "./schema";
import {
  GENERAL_ERROR_MESSAGE,
  INVALID_DATA_MESSAGE,
  NO_PERMISSION_MESSAGE,
} from "@/lib/auth/constants";
import z from "zod";
import { db } from "@/db/db";
import { ChapterTable, CourseTable, LessonTable } from "@/db/schema";
import { and, eq, gt, inArray, sql } from "drizzle-orm";
import { insertLesson, updateLesson as updateLessonDb } from "../db/lessons";
import { revalidateCourseCache } from "@/features/courses/db/cache/courses";
import { revalidateLessonCache } from "../db/cache/lessons";

export const getLesson = async (
  courseId: string,
  chapterId: string,
  lessonId: string,
) => {
  if (!(await requireAdminPermission())) return null;

  const [existingCourse] = await db
    .select()
    .from(CourseTable)
    .where(eq(CourseTable.id, courseId));
  if (!existingCourse) return null;

  const [existingChapter] = await db
    .select()
    .from(ChapterTable)
    .where(
      and(
        eq(ChapterTable.courseId, existingCourse.id),
        eq(ChapterTable.id, chapterId),
      ),
    );
  if (!existingChapter) return null;

  const [existingLesson] = await db
    .select()
    .from(LessonTable)
    .where(
      and(
        eq(LessonTable.chapterId, existingChapter.id),
        eq(LessonTable.id, lessonId),
      ),
    );
  if (!existingLesson) return null;

  return {
    lesson: existingLesson,
    chapter: existingChapter,
    course: existingCourse,
  };
};

export const createLesson = async (
  courseId: string,
  chapterId: string,
  unsafeData: CreateLessonSchemaType,
) => {
  if (!(await requireAdminPermission())) {
    return {
      error: true,
      message: NO_PERMISSION_MESSAGE,
    };
  }

  const { data, success } = createLessonSchema.safeParse(unsafeData);
  if (!success) {
    return {
      error: true,
      message: INVALID_DATA_MESSAGE,
    };
  }

  await insertLesson(courseId, { ...data, chapterId });

  return {
    error: false,
    message: "Lesson created successfully!",
  };
};

export const deleteLesson = async (chapterId: string, lessonId: string) => {
  if (!(await requireAdminPermission())) {
    return {
      error: true,
      message: NO_PERMISSION_MESSAGE,
    };
  }

  const [existingChapter] = await db
    .select()
    .from(ChapterTable)
    .where(eq(ChapterTable.id, chapterId));

  if (!existingChapter) {
    return {
      error: false,
      message: "Chapter not found.",
    };
  }

  try {
    const deletedLesson = await db.transaction(async (tx) => {
      const [deletedLesson] = await tx
        .delete(LessonTable)
        .where(
          and(
            eq(LessonTable.id, lessonId),
            eq(LessonTable.chapterId, existingChapter.id),
          ),
        )
        .returning();

      revalidateCourseCache(existingChapter.courseId);
      revalidateLessonCache(deletedLesson.id);

      await tx
        .update(LessonTable)
        .set({
          position: sql`${LessonTable.position} - 1`,
        })
        .where(
          and(
            eq(LessonTable.chapterId, chapterId),
            gt(LessonTable.position, deletedLesson.position),
          ),
        );

      return deletedLesson;
    });
    if (!deletedLesson) {
      throw new Error("DB Error");
    }

    return {
      error: false,
      message: "Lesson deleted successfully!",
    };
  } catch (error) {
    return {
      error: true,
      message: "Failed to delete lesson. Please try again.",
    };
  }
};

export const updateLesson = async (
  lessonId: string,
  unsafeData: LessonSchemaType,
) => {
  if (!(await requireAdminPermission())) {
    return {
      error: true,
      message: NO_PERMISSION_MESSAGE,
    };
  }

  const { data, success } = lessonSchema.safeParse(unsafeData);
  if (!success) {
    return {
      error: true,
      message: INVALID_DATA_MESSAGE,
    };
  }

  try {
    await updateLessonDb(lessonId, data);

    return {
      error: false,
      message: "Lesson updated successfully!",
    };
  } catch (error) {
    console.error(error);
    return {
      error: true,
      message: GENERAL_ERROR_MESSAGE,
    };
  }
};

export const reorderLessons = async (
  chapterId: string,
  unsafeData: (CreateLessonSchemaType & { id: string })[],
) => {
  if (!(await requireAdminPermission())) {
    return {
      error: true,
      message: NO_PERMISSION_MESSAGE,
    };
  }

  const { data, success } = z
    .array(createLessonSchema.extend({ id: z.string().min(1) }))
    .safeParse(unsafeData);
  if (!success) {
    return {
      error: true,
      message: INVALID_DATA_MESSAGE,
    };
  }

  const lessonIds = data.map((lesson) => lesson.id);

  const positionSql = sql`
    CASE ${LessonTable.id}
    ${sql.join(
      data.map(
        (lesson, index) => sql`WHEN ${lesson.id} THEN ${index + 1}::int`,
      ),
      sql` `,
    )}
    END
  `;

  try {
    const response = await db
      .update(LessonTable)
      .set({
        position: positionSql,
      })
      .where(
        and(
          inArray(LessonTable.id, lessonIds),
          eq(LessonTable.chapterId, chapterId),
        ),
      )
      .returning();

    if (!response || !response.length) {
      console.log(response);
      throw new Error("DB Error");
    }
  } catch (error) {
    console.error(error);
    return {
      error: true,
      message: "Failed to reorder lesson chapters. Please try again.",
    };
  }

  return {
    error: false,
    message: "Lessons reordered successfully!",
  };
};
