import { BackButton } from "@/components/back-button";
import { NoPermission } from "@/components/no-permission";
import { getLesson } from "@/features/lessons/actions/action";
import { LessonConfiguration } from "@/features/lessons/components/edit/lesson-configuration";
import { requireAdminPermission } from "@/lib/auth/permissions";
import { ArrowLeftIcon } from "lucide-react";
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
  return <div>loading</div>;
};

const CourseLessonEditSuspense = async ({ params }: CourseLessonEditProps) => {
  if (!(await requireAdminPermission())) {
    return <NoPermission />;
  }
  const { courseId, chapterId, lessonId } = await params;
  const info = await getLesson(courseId, chapterId, lessonId);
  if (!info) {
    return <div>Lesson not found</div>;
  }

  return (
    <div className="p-10 flex flex-col gap-8">
      <BackButton
        href={`/admin/courses/${info.course.id}/edit`}
        size="default"
        className="text-muted-foreground"
      >
        <ArrowLeftIcon className="text-muted-foreground" />
        Go Back
      </BackButton>
      <LessonConfiguration lesson={info.lesson} />
    </div>
  );
};

export default ChapterLessonEditPage;
