"use server";

import { db } from "@/db/db";
import { CourseTable, EnrollmentTable, LessonTable, user } from "@/db/schema";
import { count, eq, sql } from "drizzle-orm";

export const getDashboardData = async () => {
  const [totalUsers] = await db
    .select({
      total: count(),
    })
    .from(user);

  const [dashboardInfo] = await db
    .select({
      totalCourses: count(eq(CourseTable.status, "published")),
      totalEnrollments: sql<number>`(
      SELECT COUNT(*)
      FROM ${EnrollmentTable}
    )`.mapWith(Number),
      totalLessons: sql<number>`(
      SELECT COUNT(*)
      FROM ${LessonTable}
    )`.mapWith(Number),
    })
    .from(CourseTable);

  const enrollmentChartDataResult = await db.execute<{
    date: string;
    enrollments: number;
  }>(sql`
    WITH days AS (
      SELECT generate_series(
        (current_date - interval '29 days')::date,
        current_date::date,
        interval '1 day'
      )::date AS day
    ),
    daily_enrollments AS (
      SELECT
        ${EnrollmentTable.createdAt}::date AS day,
        count(*)::int AS enrollments
      FROM ${EnrollmentTable}
      WHERE ${EnrollmentTable.createdAt} >= (current_date - interval '29 days')
      GROUP BY ${EnrollmentTable.createdAt}::date
    )
    SELECT
      to_char(days.day, 'YYYY-MM-DD') AS date,
      coalesce(daily_enrollments.enrollments, 0)::int AS enrollments
    FROM days
    LEFT JOIN daily_enrollments ON daily_enrollments.day = days.day
    ORDER BY days.day
  `);

  const enrollmentChartData = enrollmentChartDataResult.rows.map((row) => ({
    date: row.date,
    enrollments: Number(row.enrollments),
  }));

  return {
    totalUsers: totalUsers.total,
    totalCourses: dashboardInfo.totalCourses,
    totalEnrollments: dashboardInfo.totalEnrollments,
    totalLessons: dashboardInfo.totalLessons,
    enrollmentChartData,
    totalEnrollmentsLast30Days: enrollmentChartData.reduce(
      (total, day) => total + day.enrollments,
      0,
    ),
  };
};
