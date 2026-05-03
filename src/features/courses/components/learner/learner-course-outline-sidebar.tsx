import { ChevronRightIcon, PlayIcon } from "lucide-react";
import { Suspense } from "react";
import { getCourse } from "../../actions/actions";
import { formatCourseCategory } from "../../lib/formatters";
import { LearnerProgress } from "./learner-progress";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

type LearnerCourseOutlineSidebarProps = {
  courseId: string;
  lessonId: string;
  chapterId: string;
};

const colorMap = {
  active: {
    icon: "fill-primary text-primary",
    iconWrapper: "border-primary bg-primary/20",
    card: "border-none bg-primary/20 text-primary",
  },
  completed: {
    icon: "text-emerald-400 fill-emerald-400",
    iconWrapper: "border-emerald-400 bg-emerald-400/20",
    card: "border-none bg-emerald-400/20 text-emerald-400",
  },
};

export const LearnerCourseOutlineSidebar = (
  props: LearnerCourseOutlineSidebarProps,
) => {
  return (
    <Suspense fallback={<LearnerCourseOutlineSidebarLoading />}>
      <LearnerCourseOutlineSidebarSuspense {...props} />
    </Suspense>
  );
};

const LearnerCourseOutlineSidebarLoading = () => {
  return (
    <div className="w-full border-r h-full">
      <div className="flex flex-col gap-4 p-4">
        <div className="flex items-center gap-2">
          <Skeleton className="size-10 shrink-0 rounded-md" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-2 w-full" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <Separator />
      <div className="p-4 flex flex-col gap-2 overflow-y-auto">
        {Array.from({ length: 3 }).map((_, index) => (
          <div className="space-y-4" key={index}>
            <div className="p-4 border bg-card flex items-center gap-2">
              <Skeleton className="size-4 shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
            <div className="border-l-4 pl-6 flex flex-col gap-4">
              {Array.from({ length: 2 }).map((_, lessonIndex) => (
                <div
                  className="flex items-center gap-4 p-4 rounded-md border bg-card"
                  key={lessonIndex}
                >
                  <Skeleton className="size-7 rounded-full shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const LearnerCourseOutlineSidebarSuspense = async ({
  courseId,
  lessonId,
  chapterId,
}: LearnerCourseOutlineSidebarProps) => {
  const course = await getCourse(courseId);
  if (!course) {
    return (
      <div className="w-full border-r h-full p-4">
        <div className="rounded-md border bg-card p-5 text-center">
          <div className="mx-auto size-10 rounded-md bg-muted flex items-center justify-center mb-3">
            <PlayIcon className="size-5 text-muted-foreground" />
          </div>
          <h2 className="text-base font-semibold">Course not found</h2>
          <p className="text-sm text-muted-foreground mt-1">
            This course outline is not available.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full border-r h-full">
      <div className="flex flex-col gap-2 p-4">
        <div className="flex items-center gap-2">
          <div className="size-10 shrink-0 rounded-md bg-primary/20 flex items-center justify-center">
            <PlayIcon className="size-6 text-primary" />
          </div>
          <div className="flex-1 flex flex-col">
            <h2 className="text-lg font-semibold line-clamp-1">
              {course.title}
            </h2>
            <span className="text-sm text-muted-foreground line-clamp-1">
              {formatCourseCategory(course.category)}
            </span>
          </div>
        </div>
        <LearnerProgress
          lessons={course.chapters
            .flatMap((chapter) => chapter.lessons)
            .map((lesson) => ({
              ...lesson,
              progress: lesson.progress?.[0] ?? null,
            }))}
        />
      </div>
      <Separator />
      <div className="p-4 flex flex-col gap-2 overflow-y-auto">
        {course.chapters.map((chapter) => {
          const isChapterComplete = chapter.lessons.every(
            (lesson) => !!lesson.progress?.[0]?.completed,
          );
          return (
            <Collapsible
              key={chapter.id}
              defaultOpen={chapterId === chapter.id}
            >
              <CollapsibleTrigger
                className={cn(
                  "group p-4 border bg-card cursor-pointer w-full flex items-center gap-2",
                  isChapterComplete && colorMap.completed.card,
                )}
              >
                <ChevronRightIcon
                  className={cn(
                    "text-primary fill-primary shrink-0 size-4 transition-all duration-300 group-data-[state=open]:rotate-90",
                    isChapterComplete && colorMap.completed.icon,
                  )}
                />
                <div className="flex flex-col items-start gap-0.5">
                  <span className="text-base font-semibold text-start line-clamp-1">
                    {chapter.position}. {chapter.name}
                  </span>
                  <span
                    className={cn(
                      "text-muted-foreground text-start text-sm",
                      isChapterComplete && colorMap.completed.icon,
                    )}
                  >
                    {chapter.lessons.length} lessons
                  </span>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent
                className={cn(
                  "border-l-4 pl-6 mt-4 mb-2 flex flex-col gap-4",
                  isChapterComplete && "border-emerald-400/20",
                )}
              >
                {chapter.lessons.map((lesson) => {
                  const isActive = lesson.id === lessonId;
                  const isCompleted = !!lesson.progress?.[0]?.completed;

                  return (
                    <Link
                      key={lesson.id}
                      href={`/dashboard/${courseId}/${lesson.id}`}
                      className="w-full"
                    >
                      <div
                        className={cn(
                          "flex items-center gap-4 p-4 rounded-md border bg-card",
                          isActive && colorMap.active.card,
                          isCompleted && colorMap.completed.card,
                        )}
                      >
                        <div
                          className={cn(
                            "size-7 border-2 border-muted-foreground shrink-0 rounded-full flex items-center justify-center",
                            isActive && colorMap.active.iconWrapper,
                            isCompleted && colorMap.completed.iconWrapper,
                          )}
                        >
                          <PlayIcon
                            className={cn(
                              "size-3 fill-muted-foreground text-muted-foreground",
                              isActive && colorMap.active.icon,
                              isCompleted && colorMap.completed.icon,
                            )}
                          />
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-base font-semibold line-clamp-1">
                            {lesson.position}. {lesson.name}
                          </span>
                          {(isActive || isCompleted) && (
                            <span className="text-sm">
                              {isCompleted
                                ? "Completed"
                                : isActive
                                  ? "Currently watching"
                                  : undefined}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </div>
    </div>
  );
};
