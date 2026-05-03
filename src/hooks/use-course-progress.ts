import { LessonProgressTable, LessonTable } from "@/db/schema";
import { useMemo } from "react";

export const useCourseProgress = (
  lessons: (typeof LessonTable.$inferSelect & {
    progress?: typeof LessonProgressTable.$inferSelect | null;
  })[],
) => {
  const completedCount = useMemo(() => {
    return lessons.filter((lesson) => lesson.progress?.completed).length;
  }, [lessons]);

  const completionPercentage = useMemo(() => {
    return completedCount / lessons.length;
  }, [completedCount]);

  const progressCompletionPercentage = useMemo(() => {
    return Math.round(completionPercentage * 100);
  }, [completionPercentage]);

  const isCompleted = useMemo(() => {
    return completedCount === lessons.length && completionPercentage === 1;
  }, [completedCount, lessons, completionPercentage]);

  const firstLesson = useMemo(() => {
    return lessons?.[0] ?? null;
  }, [lessons]);

  const nextLesson = useMemo(() => {
    return lessons.filter((lesson) => !lesson.progress?.completed)?.[0] ?? null;
  }, [lessons]);

  return {
    completedCount,
    completionPercentage,
    progressCompletionPercentage,
    isCompleted,
    firstLesson,
    nextLesson,
  };
};
