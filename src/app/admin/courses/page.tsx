import { NoPermission } from "@/components/no-permission";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getAdminCourses } from "@/features/courses/actions/actions";
import { AdminCourseCard } from "@/features/courses/components/admin-course.card";
import { requireAdminPermission } from "@/lib/auth/permissions";
import { BookIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

const AdminCoursesPage = () => {
  return (
    <div className="p-10 @container space-y-8">
      <div className="flex items-center gap-2 justify-between flex-wrap">
        <h1 className="text-3xl font-bold">Your Courses</h1>
        <Button asChild>
          <Link href="/admin/courses/create">Create Course</Link>
        </Button>
      </div>
      <Suspense fallback={<AdminCourseLoading />}>
        <AdminCoursesSuspense />
      </Suspense>
    </div>
  );
};

const AdminCourseLoading = () => {
  return (
    <div className="grid grid-cols-1 gap-8 @lg:grid-cols-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index} className="p-0">
          <CardContent className="p-0">
            <div className="relative h-80">
              <Skeleton className="size-full rounded-b-none" />
              <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="size-9" />
              </div>
            </div>
            <div className="p-5 flex flex-col gap-2">
              <Skeleton className="h-8 w-4/5" />
              <div className="space-y-2 mb-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
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
              <Skeleton className="h-9 w-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const AdminCoursesSuspense = async () => {
  if (!(await requireAdminPermission())) {
    return <NoPermission />;
  }
  const courses = await getAdminCourses();

  return courses.length ? (
    <div className="grid grid-cols-1 gap-8 @lg:grid-cols-2">
      {courses.map((course) => (
        <AdminCourseCard key={course.id} course={course} />
      ))}
    </div>
  ) : (
    <div className="p-10 rounded-md border-2 border-dashed bg-card flex flex-col items-center">
      <div className="size-20 rounded-full flex items-center justify-center bg-accent">
        <BookIcon className="size-12 text-muted-foreground" />
      </div>
      <h1 className="text-2xl font-semibold mt-4 text-center">
        No Courses Yet
      </h1>
      <p className="text-base text-muted-foreground max-w-100 mt-1 mb-4 text-center">
        Looks like you haven&apos;t created any courses yet. Click the button
        below to get started.
      </p>
      <Button className="max-w-100 w-full" variant="outline">
        <Link href="/admin/courses/create">Create Course</Link>
      </Button>
    </div>
  );
};

export default AdminCoursesPage;
