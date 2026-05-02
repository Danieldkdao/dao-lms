import { NoPermission } from "@/components/no-permission";
import { getCourse } from "@/features/courses/actions/actions";
import { CourseNotFound } from "@/features/courses/components/course-not-found";
import { DeleteCard } from "@/features/courses/components/delete/delete-card";
import { requireAdminPermission } from "@/lib/auth/permissions";
import { Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type CourseDeleteProps = {
  params: Promise<{ courseId: string }>;
};

const CourseDeletePage = (props: CourseDeleteProps) => {
  return (
    <Suspense fallback={<CourseDeleteLoading />}>
      <CourseDeleteSuspense {...props} />
    </Suspense>
  );
};

const CourseDeleteLoading = () => {
  return (
    <div className="w-full h-full flex items-center justify-center p-10">
      <div className="max-w-250 w-full">
        <Card>
          <CardContent className="flex flex-col gap-4">
            <div className="space-y-2">
              <Skeleton className="h-6 w-full max-w-80" />
              <Skeleton className="h-5 w-full max-w-56" />
            </div>

            <div className="w-full flex flex-wrap items-center gap-2 justify-between">
              <Skeleton className="h-10 w-full sm:w-24" />
              <Skeleton className="h-10 w-full sm:w-24" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const CourseDeleteSuspense = async ({ params }: CourseDeleteProps) => {
  if (!(await requireAdminPermission())) {
    return <NoPermission />;
  }
  const { courseId } = await params;
  const course = await getCourse(courseId);
  if (!course) {
    return <CourseNotFound />;
  }

  return (
    <div className="w-full h-full flex items-center justify-center p-10">
      <div className="max-w-250 w-full">
        <DeleteCard course={course} />
      </div>
    </div>
  );
};

export default CourseDeletePage;
