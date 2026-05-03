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

  return {
    completedCount,
    completionPercentage,
    progressCompletionPercentage,
  };
};
