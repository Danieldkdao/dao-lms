"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CourseTable, LessonProgressTable, LessonTable } from "@/db/schema";
import { generateFileUrl } from "@/lib/utils";
import { ArrowRightIcon, CheckIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatCourseLevel } from "../../lib/formatters";
import { useCourseProgress } from "@/hooks/use-course-progress";

export const LearnerCourseCard = ({
  course,
  lessons,
}: {
  course: typeof CourseTable.$inferSelect;
  lessons: (typeof LessonTable.$inferSelect & {
    progress?: typeof LessonProgressTable.$inferSelect | null;
  })[];
}) => {
  const {
    completedCount,
    progressCompletionPercentage,
    isCompleted,
    firstLesson,
    nextLesson,
  } = useCourseProgress(lessons);

  return (
    <Link
      href={
        nextLesson || firstLesson
          ? `/dashboard/${course.id}/${nextLesson?.id || firstLesson?.id}`
          : "#"
      }
      className="w-full h-full"
    >
      <Card className="p-0 group h-full">
        <CardContent className="p-0">
          <div className="relative h-80">
            <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
              <Badge variant="secondary">
                {formatCourseLevel(course.level)}
              </Badge>
            </div>
            <Image
              src={generateFileUrl(course.thumbnailKey)}
              alt={`${course.title} image`}
              fill
              sizes="(max-width: 37rem) calc(100vw - 5rem), calc((100vw - 7rem) / 2)"
              className="object-cover"
              loading="eager"
            />
          </div>
          <div className="p-5 flex flex-col gap-2">
            <h1 className="text-2xl font-semibold line-clamp-2 group-hover:text-primary transition-all duration-300 hover:underline">
              {course.title}
            </h1>
            <p className="text-muted-foreground line-clamp-2 text-sm mb-2">
              {course.smallDescription}
            </p>
            <div className="flex flex-col gap-1 mb-4">
              <div className="flex items-center gap-2 justify-between flex-wrap">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm font-medium">
                  {progressCompletionPercentage}%
                </span>
              </div>
              <Progress value={progressCompletionPercentage} />
              <span className="text-muted-foreground text-sm">
                {completedCount} of {lessons.length} lessons completed
              </span>
            </div>
            <Button className="w-full" variant="outline" disabled={isCompleted}>
              {isCompleted ? (
                <>
                  Completed
                  <CheckIcon />
                </>
              ) : (
                <>
                  Continue Learning
                  <ArrowRightIcon />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
