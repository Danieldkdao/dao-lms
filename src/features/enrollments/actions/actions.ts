"use server";

import { db } from "@/db/db";
import {
  ChapterTable,
  EnrollmentTable,
  LessonProgressTable,
  LessonTable,
} from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { cacheTag } from "next/cache";
import { getUserEnrollmentTag } from "../db/cache/enrollments";

export const getEnrolledCourses = async (userId: string) => {
  "use cache";
  cacheTag(getUserEnrollmentTag(userId));

  const enrollments = await db.query.EnrollmentTable.findMany({
    where: eq(EnrollmentTable.userId, userId),
    with: {
      course: {
        with: {
          chapters: {
            with: {
              lessons: {
                with: {
                  progress: {
                    where: eq(LessonProgressTable.userId, userId),
                    limit: 1,
                  },
                },
                orderBy: [asc(LessonTable.position), asc(LessonTable.id)],
              },
            },
            orderBy: [asc(ChapterTable.position), asc(ChapterTable.id)],
          },
        },
      },
    },
  });

  return enrollments;
};
