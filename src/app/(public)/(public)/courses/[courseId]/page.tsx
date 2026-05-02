import { MarkdownRenderer } from "@/components/markdown/markdown-renderer";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { db } from "@/db/db";
import { ChapterTable, CourseTable, LessonTable } from "@/db/schema";
import { CourseNotFound } from "@/features/courses/components/course-not-found";
import { CourseDetailsSide } from "@/features/courses/components/public/course-details-side";
import { Lesson } from "@/features/courses/components/public/lesson";
import { getCourseGlobalTag } from "@/features/courses/db/cache/courses";
import {
  formatCourseCategory,
  formatCourseLevel,
} from "@/features/courses/lib/formatters";
import { generateImageUrl } from "@/lib/utils";
import { asc, eq } from "drizzle-orm";
import {
  ChartNoAxesColumn,
  ChevronUpIcon,
  ClockIcon,
  LayoutGridIcon,
} from "lucide-react";
import { cacheTag } from "next/cache";
import Image from "next/image";
import { Suspense } from "react";

type CourseIdProps = {
  params: Promise<{ courseId: string }>;
};

const CourseIdPage = (props: CourseIdProps) => {
  return (
    <Suspense>
      <CourseIdSuspense {...props} />
    </Suspense>
  );
};

const CourseIdSuspense = async ({ params }: CourseIdProps) => {
  const { courseId } = await params;
  const course = await getCourse(courseId);
  if (!course) {
    return <CourseNotFound href="/courses" />;
  }

  const lessons = course.chapters.flatMap((chapter) => chapter.lessons);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr] gap-8 items-start">
      <div className="w-full flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <div className="relative h-80 sm:h-100 md:h-110 lg:h-125 w-full rounded-xl overflow-hidden">
            <Image
              src={generateImageUrl(course.thumbnailKey)}
              alt="Thumbnail image"
              fill
              sizes="(max-width: 48rem) calc(100vw - 2rem), 60vw"
              className="object-cover"
            />
          </div>
          <h1 className="text-4xl font-semibold">{course.title}</h1>
          <p className="text-lg text-muted-foreground line-clamp-2">
            {course.smallDescription}
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className="px-4">
              <ChartNoAxesColumn />
              {formatCourseLevel(course.level)}
            </Badge>
            <Badge className="px-4">
              <LayoutGridIcon />
              {formatCourseCategory(course.category)}
            </Badge>
            <Badge className="px-4">
              <ClockIcon />
              {course.duration} hours
            </Badge>
          </div>
        </div>
        <Separator />
        <div className="flex flex-col gap-4">
          <h2 className="text-3xl font-semibold">Course Description</h2>
          <MarkdownRenderer content={course.description} />
        </div>
        <div className="space-y-8">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-3xl font-semibold">Course Content</h2>
            <span className="text-base text-muted-foreground">
              {course.chapters.length} chapters • {lessons.length} lessons
            </span>
          </div>
          <div className="flex flex-col gap-4">
            {course.chapters.map((chapter) => (
              <Collapsible className="border group" key={chapter.id}>
                <CollapsibleTrigger className="flex group items-center gap-2 w-full cursor-pointer rounded-lg group-data-[state=open]:border-b p-5">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="size-14 rounded-full bg-primary/20 shrink-0 flex items-center justify-center">
                      <span className="text-xl font-semibold text-primary">
                        {chapter.position}
                      </span>
                    </div>
                    <div className="flex flex-col items-start gap-1">
                      <span className="text-xl text-start font-semibold line-clamp-1">
                        {chapter.name}
                      </span>
                      <span className="text-base text-muted-foreground">
                        {chapter.lessons.length} lessons
                      </span>
                    </div>
                  </div>
                  <ChevronUpIcon className="transition-all duration-300 group-data-[state=open]:rotate-180" />
                </CollapsibleTrigger>
                <CollapsibleContent className="flex flex-col gap-2 p-5">
                  {chapter.lessons.map((lesson) => (
                    <Lesson lesson={lesson} key={lesson.id} />
                  ))}
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </div>
      </div>
      <div className="w-full md:sticky md:top-28">
        <CourseDetailsSide course={course} lessons={lessons.length} />
      </div>
    </div>
  );
};

const getCourse = async (courseId: string) => {
  "use cache";
  cacheTag(getCourseGlobalTag());

  const course = await db.query.CourseTable.findFirst({
    where: eq(CourseTable.id, courseId),
    with: {
      chapters: {
        with: {
          lessons: {
            orderBy: [asc(LessonTable.position), asc(LessonTable.id)],
          },
        },
        orderBy: [asc(ChapterTable.position), asc(ChapterTable.id)],
      },
    },
  });

  return course ?? null;
};

export default CourseIdPage;
