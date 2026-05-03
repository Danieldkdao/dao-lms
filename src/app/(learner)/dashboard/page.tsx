import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getAvailableCourses } from "@/features/courses/actions/actions";
import { LearnerCourseCard } from "@/features/courses/components/learner/learner-course-card";
import { PublicCourseCard } from "@/features/courses/components/public/public-course-card";
import { getEnrolledCourses } from "@/features/enrollments/actions/actions";
import { auth } from "@/lib/auth/auth";
import { BookIcon } from "lucide-react";
import { headers } from "next/headers";
import { Suspense } from "react";

const DashboardPage = () => {
  return (
    <div className="p-10 @container space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Your Courses</h1>
        <p className="text-base text-muted-foreground">
          Here you can see all your enrolled courses.
        </p>
      </div>
      <Suspense fallback={<DashboardEnrolledLoading />}>
        <DashboardEnrolledSuspense />
      </Suspense>
      <div className="flex flex-col gap-2 mt-20">
        <h1 className="text-3xl font-bold">Available Courses</h1>
        <p className="text-base text-muted-foreground">
          Here you can see the courses you can purchase.
        </p>
      </div>
      <Suspense fallback={<DashboardAvailableLoading />}>
        <DashboardAvailableSuspense />
      </Suspense>
    </div>
  );
};

const DashboardEnrolledLoading = () => {
  return (
    <div className="grid grid-cols-1 gap-8 @lg:grid-cols-2">
      {Array.from({ length: 2 }).map((_, index) => (
        <DashboardCourseCardSkeleton key={index} showProgress />
      ))}
    </div>
  );
};

const DashboardEnrolledSuspense = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return null;
  }

  const enrollments = await getEnrolledCourses(session.user.id);

  return enrollments.length ? (
    <div className="grid grid-cols-1 gap-8 @lg:grid-cols-2">
      {enrollments.map((enrollment) => (
        <LearnerCourseCard
          key={enrollment.id}
          course={enrollment.course}
          lessons={enrollment.course.chapters
            .flatMap((chapter) => chapter.lessons)
            .map((lesson) => ({
              ...lesson,
              progress: lesson.progress?.[0] ?? null,
            }))}
        />
      ))}
    </div>
  ) : (
    <div className="p-10 rounded-md border-2 border-dashed bg-card flex flex-col items-center">
      <div className="size-20 rounded-full flex items-center justify-center bg-accent">
        <BookIcon className="size-12 text-muted-foreground" />
      </div>
      <h1 className="text-2xl font-semibold mt-4 text-center">
        No Enrolled Courses
      </h1>
      <p className="text-base text-muted-foreground max-w-100 mt-1 text-center">
        Looks like you haven&apos;t enrolled in any courses yet. Explore our
        course catalog and begin your learning journey today!
      </p>
    </div>
  );
};

const DashboardAvailableLoading = () => {
  return (
    <div className="grid grid-cols-1 gap-8 @lg:grid-cols-2">
      {Array.from({ length: 2 }).map((_, index) => (
        <DashboardCourseCardSkeleton key={index} />
      ))}
    </div>
  );
};

const DashboardAvailableSuspense = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return null;
  }

  const courses = await getAvailableCourses(session.user.id);

  return courses.length ? (
    <div className="grid grid-cols-1 gap-8 @lg:grid-cols-2">
      {courses.map((course) => (
        <PublicCourseCard key={course.id} course={course} />
      ))}
    </div>
  ) : (
    <div className="p-10 rounded-md border-2 border-dashed bg-card flex flex-col items-center">
      <div className="size-20 rounded-full flex items-center justify-center bg-accent">
        <BookIcon className="size-12 text-muted-foreground" />
      </div>
      <h1 className="text-2xl font-semibold mt-4 text-center">
        No Available Courses
      </h1>
      <p className="text-base text-muted-foreground max-w-100 mt-1 text-center">
        Looks like we don&apos;t have any more courses to offer you! Come back
        later when we have added more awesome courses to our catalog!
      </p>
    </div>
  );
};

const DashboardCourseCardSkeleton = ({
  showProgress = false,
}: {
  showProgress?: boolean;
}) => {
  return (
    <Card className="p-0 h-full">
      <CardContent className="p-0">
        <div className="relative h-80">
          <Skeleton className="size-full rounded-b-none" />
          <div className="absolute top-2 right-2 z-10">
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </div>
        <div className="p-5 flex flex-col gap-2">
          <Skeleton className="h-8 w-4/5" />
          <div className="space-y-2 mb-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          {showProgress ? (
            <div className="flex flex-col gap-2 mb-4">
              <div className="flex items-center gap-2 justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-10" />
              </div>
              <Skeleton className="h-2 w-full" />
              <Skeleton className="h-4 w-40" />
            </div>
          ) : (
            <div className="flex items-center gap-4 flex-wrap mb-2">
              <div className="flex items-center gap-2">
                <Skeleton className="size-7 rounded-lg" />
                <Skeleton className="h-5 w-20" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="size-7 rounded-lg" />
                <Skeleton className="h-5 w-24" />
              </div>
            </div>
          )}

          <Skeleton className="h-9 w-full" />
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardPage;
