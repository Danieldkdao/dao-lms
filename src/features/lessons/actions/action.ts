"use server";

import { requireAdminPermission } from "@/lib/auth/permissions";
import { lessonSchema, LessonSchemaType } from "./schema";
import {
  INVALID_DATA_MESSAGE,
  NO_PERMISSION_MESSAGE,
} from "@/lib/auth/constants";
import z from "zod";
import { db } from "@/db/db";
import { LessonTable } from "@/db/schema";
import { and, eq, inArray, sql } from "drizzle-orm";
import { insertLesson } from "../db/lessons";

export const createLesson = async (
  courseId: string,
  chapterId: string,
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

  await insertLesson(courseId, { ...data, chapterId });

  return {
    error: false,
    message: "Lesson created successfully!",
  };
};

export const reorderLessons = async (
  chapterId: string,
  unsafeData: (LessonSchemaType & { id: string })[],
) => {
  if (!(await requireAdminPermission())) {
    return {
      error: true,
      message: NO_PERMISSION_MESSAGE,
    };
  }

  const { data, success } = z
    .array(lessonSchema.extend({ id: z.string().min(1) }))
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
