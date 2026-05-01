"use server";

import { requireAdminPermission } from "@/lib/auth/permissions";
import { chapterSchema, ChapterSchemaType } from "./schema";
import {
  INVALID_DATA_MESSAGE,
  NO_PERMISSION_MESSAGE,
} from "@/lib/auth/constants";
import { insertChapter } from "../db/chapters";
import z from "zod";
import { db } from "@/db/db";
import { ChapterTable } from "@/db/schema";
import { and, eq, inArray, sql } from "drizzle-orm";

export const createChapter = async (
  courseId: string,
  unsafeData: ChapterSchemaType,
) => {
  if (!(await requireAdminPermission())) {
    return {
      error: true,
      message: NO_PERMISSION_MESSAGE,
    };
  }

  const { data, success } = chapterSchema.safeParse(unsafeData);
  if (!success) {
    return {
      error: true,
      message: INVALID_DATA_MESSAGE,
    };
  }

  await insertChapter({ ...data, courseId });

  return {
    error: false,
    message: "Chapter created successfully!",
  };
};

export const reorderChapters = async (
  courseId: string,
  unsafeData: (ChapterSchemaType & { id: string })[],
) => {
  if (!(await requireAdminPermission())) {
    return {
      error: true,
      message: NO_PERMISSION_MESSAGE,
    };
  }

  const { data, success } = z
    .array(chapterSchema.extend({ id: z.string().min(1) }))
    .safeParse(unsafeData);
  if (!success) {
    return {
      error: true,
      message: INVALID_DATA_MESSAGE,
    };
  }

  const chapterIds = data.map((chapter) => chapter.id);

  const positionSql = sql`
    CASE ${ChapterTable.id}
    ${sql.join(
      data.map(
        (chapter, index) => sql`WHEN ${chapter.id} THEN ${index + 1}::int`,
      ),
      sql` `,
    )}
    END
  `;

  try {
    const response = await db
      .update(ChapterTable)
      .set({
        position: positionSql,
      })
      .where(
        and(
          inArray(ChapterTable.id, chapterIds),
          eq(ChapterTable.courseId, courseId),
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
      message: "Failed to reorder course chapters. Please try again.",
    };
  }

  return {
    error: false,
    message: "Chapters reordered successfully!",
  };
};
