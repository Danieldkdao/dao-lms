import { BackButton } from "@/components/back-button";
import { NoPermission } from "@/components/no-permission";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getLesson } from "@/features/lessons/actions/action";
import { LessonConfiguration } from "@/features/lessons/components/edit/lesson-configuration";
import { requireAdminPermission } from "@/lib/auth/permissions";
import { ArrowLeftIcon, SearchXIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

type CourseLessonEditProps = {
  params: Promise<{ courseId: string; chapterId: string; lessonId: string }>;
};

const ChapterLessonEditPage = (props: CourseLessonEditProps) => {
  return (
    <Suspense fallback={<CourseLessonEditLoading />}>
      <CourseLessonEditSuspense {...props} />
    </Suspense>
  );
};

const CourseLessonEditLoading = () => {
  return (
    <div className="p-10 flex flex-col gap-8">
      <Skeleton className="h-10 w-28" />
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-44" />
          <Skeleton className="h-4 w-80" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-36 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-60 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-60 w-full" />
          </div>
          <Skeleton className="h-10 w-full max-w-36" />
        </CardContent>
      </Card>
    </div>
  );
};

const LessonNotFound = ({ courseId }: { courseId: string }) => {
  return (
    <div className="p-10">
      <Card className="mx-auto max-w-xl">
        <CardHeader className="items-center text-center">
          <div className="bg-muted text-muted-foreground flex size-12 items-center justify-center rounded-full">
            <SearchXIcon className="size-6" />
          </div>
          <CardTitle>Lesson not found</CardTitle>
          <CardDescription>
            This lesson may have been deleted or the link may be incorrect.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button asChild variant="outline">
            <Link href={`/admin/courses/${courseId}/edit`}>Back to course</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

const CourseLessonEditSuspense = async ({ params }: CourseLessonEditProps) => {
  if (!(await requireAdminPermission())) {
    return <NoPermission />;
  }
  const { courseId, chapterId, lessonId } = await params;
  const data = await getLesson(courseId, chapterId, lessonId);
  if (!data) {
    return <LessonNotFound courseId={courseId} />;
  }

  return (
    <div className="p-10 flex flex-col gap-8">
      <BackButton
        href={`/admin/courses/${data.course.id}/edit`}
        size="default"
        className="text-muted-foreground"
      >
        <ArrowLeftIcon className="text-muted-foreground" />
        Go Back
      </BackButton>
      <LessonConfiguration courseId={data.course.id} lesson={data.lesson} />
    </div>
  );
};

export default ChapterLessonEditPage;
