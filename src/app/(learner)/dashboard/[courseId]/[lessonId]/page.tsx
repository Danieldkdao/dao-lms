import { MarkdownRenderer } from "@/components/markdown/markdown-renderer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { userHasCourse } from "@/features/enrollments/lib/helpers";
import { getLearnerLesson } from "@/features/lessons/actions/action";
import { auth } from "@/lib/auth/auth";
import { generateFileUrl } from "@/lib/utils";
import { CheckCircleIcon } from "lucide-react";
import { headers } from "next/headers";
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
  return <div>loading</div>;
};

const CourseLearningLessonSuspense = async ({
  params,
}: CourseLearningLessonParams) => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  const { courseId, lessonId } = await params;

  const hasAccess = await userHasCourse(session.user.id, courseId);
  if (!hasAccess) {
    return <div>no access state</div>;
  }

  const lesson = await getLearnerLesson(lessonId);
  if (!lesson) {
    return <div>lesson not found</div>;
  }

  return (
    <div className="grid grid-cols-[375px_1fr] gap-8">
      <div></div>
      <div className="p-5 flex flex-col gap-4">
        {lesson.videoKey && (
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
        )}
        <Button variant="outline" className="gap-4 w-fit">
          <CheckCircleIcon className="text-emerald-600" />
          Mark as Complete
        </Button>
        <Separator />
        <div>
          <h1 className="text-3xl font-semibold">{lesson.name}</h1>
          <MarkdownRenderer content={lesson.description} />
        </div>
      </div>
    </div>
  );
};

export default CourseLearningLessonPage;
