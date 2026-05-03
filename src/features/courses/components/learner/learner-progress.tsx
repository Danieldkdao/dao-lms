"use client";

import { Progress } from "@/components/ui/progress";
import { LessonProgressTable, LessonTable } from "@/db/schema";
import { useCourseProgress } from "@/hooks/use-course-progress";

export const LearnerProgress = ({
  lessons,
}: {
  lessons: (typeof LessonTable.$inferSelect & {
    progress?: typeof LessonProgressTable.$inferSelect | null;
  })[];
}) => {
  const { progressCompletionPercentage, completedCount } =
    useCourseProgress(lessons);
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 justify-between flex-wrap">
        <span className="text-sm font-medium text-muted-foreground">
          Progress
        </span>
        <span className="text-sm font-medium text-muted-foreground">
          {completedCount}/{lessons.length} lessons
        </span>
      </div>
      <Progress value={progressCompletionPercentage} />
      <span className="text-muted-foreground text-sm">
        {progressCompletionPercentage}% complete
      </span>
    </div>
  );
};
