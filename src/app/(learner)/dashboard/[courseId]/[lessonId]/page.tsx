import { MarkdownRenderer } from "@/components/markdown/markdown-renderer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { LearnerCourseOutlineSidebar } from "@/features/courses/components/learner/learner-course-outline-sidebar";
import { userHasCourse } from "@/features/enrollments/lib/helpers";
import { getLearnerLesson } from "@/features/lessons/actions/action";
import { MarkCompleteButton } from "@/features/lessons/components/learner/mark-complete-button";
import { auth } from "@/lib/auth/auth";
import { generateFileUrl } from "@/lib/utils";
import { LockIcon, SearchXIcon } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { Suspense } from "react";

type CourseLearningLessonParams = {
  params: Promise<{ courseId: string; lessonId: string }>;
};

const CourseLearningLessonPage = (props: CourseLearningLessonParams) => {
  return (
    <Suspense fallback={<CourseLearningLessonLoading />}>
      <CourseLearningLessonSuspense {...props} />
    </Suspense>
  );
};

const CourseLearningLessonLoading = () => {
  return (
    <div className="grid grid-cols-[375px_minmax(0,1fr)]">
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
        <div className="p-4 flex flex-col gap-2">
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
      <LessonContentSkeleton />
    </div>
  );
};

const CourseLearningLessonSuspense = async ({
  params,
}: CourseLearningLessonParams) => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return <UnauthedLessonState />;

  const { courseId, lessonId } = await params;

  const hasAccess = await userHasCourse(session.user.id, courseId);
  if (!hasAccess) {
    return <NoCourseAccessState courseId={courseId} />;
  }

  const lesson = await getLearnerLesson(session.user.id, lessonId);
  if (!lesson) {
    return <LessonNotFoundState courseId={courseId} />;
  }

  return (
    <div className="grid grid-cols-[375px_minmax(0,1fr)]">
      <div className="w-full">
        <LearnerCourseOutlineSidebar
          courseId={courseId}
          chapterId={lesson.chapterId}
          lessonId={lesson.id}
        />
      </div>
      <div className="min-w-0 p-5 flex flex-col gap-4">
        {lesson.videoKey ? (
          <video
            src={generateFileUrl(lesson.videoKey)}
            controls
            width="100%"
            preload="metadata"
            style={{ borderRadius: "6px" }}
            poster={
              lesson.thumbnailKey
                ? generateFileUrl(lesson.thumbnailKey)
                : undefined
            }
          />
        ) : (
          <div className="italic text-muted-foreground font-medium">
            No video was published for this lesson.
          </div>
        )}
        <MarkCompleteButton
          courseId={courseId}
          lessonId={lesson.id}
          isCompleted={!!lesson.progress?.completed}
        />
        <Separator />
        <div className="min-w-0">
          <h1 className="text-3xl font-semibold">{lesson.name}</h1>
          <MarkdownRenderer content={lesson.description} />
        </div>
      </div>
    </div>
  );
};

const LessonContentSkeleton = () => {
  return (
    <div className="p-5 flex flex-col gap-4">
      <Skeleton className="aspect-video w-full rounded-md" />
      <Skeleton className="h-9 w-40" />
      <Separator />
      <div className="space-y-4">
        <Skeleton className="h-9 w-full max-w-xl" />
        <div className="space-y-3">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-5/6" />
          <Skeleton className="h-5 w-3/4" />
        </div>
      </div>
    </div>
  );
};

const UnauthedLessonState = () => {
  return (
    <CenteredStateCard
      icon={<LockIcon className="size-6" />}
      title="Sign in to continue"
      description="You need to sign in before you can watch this lesson."
      action={
        <Button asChild>
          <Link href="/sign-in">Sign in</Link>
        </Button>
      }
    />
  );
};

const NoCourseAccessState = ({ courseId }: { courseId: string }) => {
  return (
    <CenteredStateCard
      icon={<LockIcon className="size-6" />}
      title="Course access required"
      description="You do not have access to this course yet. Visit the course details page to enroll and start learning."
      action={
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <Button asChild>
            <Link href={`/courses/${courseId}`}>View course details</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard">Back to dashboard</Link>
          </Button>
        </div>
      }
    />
  );
};

const LessonNotFoundState = ({ courseId }: { courseId: string }) => {
  return (
    <CenteredStateCard
      icon={<SearchXIcon className="size-6" />}
      title="Lesson not found"
      description="This lesson may have been removed, unpublished, or the link may be incorrect."
      action={
        <Button asChild variant="outline">
          <Link href={`/courses/${courseId}`}>View course details</Link>
        </Button>
      }
    />
  );
};

const CenteredStateCard = ({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action: React.ReactNode;
}) => {
  return (
    <div className="p-10 min-h-[calc(100svh-var(--header-height))] flex items-center justify-center">
      <Card className="w-full max-w-xl">
        <CardContent className="flex flex-col items-center gap-5 text-center">
          <div className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-full">
            {icon}
          </div>
          <h1 className="text-lg font-semibold">{title}</h1>
          <p className="text-muted-foreground max-w-md">{description}</p>
          {action}
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseLearningLessonPage;
