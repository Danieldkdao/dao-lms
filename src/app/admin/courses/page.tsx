import { NoPermission } from "@/components/no-permission";
import { Button } from "@/components/ui/button";
import { getCourses } from "@/features/courses/actions/actions";
import { AdminCourseCard } from "@/features/courses/components/admin-course.card";
import { requireAdminPermission } from "@/lib/auth/permissions";
import Link from "next/link";
import { Suspense } from "react";

const AdminCoursesPage = () => {
  return (
    <Suspense>
      <AdminCoursesSuspense />
    </Suspense>
  );
};

const AdminCoursesSuspense = async () => {
  if (!(await requireAdminPermission())) {
    return <NoPermission />;
  }
  const courses = await getCourses();

  return (
    <div className="p-10 @container space-y-8">
      <div className="flex items-center gap-2 justify-between flex-wrap">
        <h1 className="text-3xl font-bold">Your Courses</h1>
        <Button asChild>
          <Link href="/admin/courses/create">Create Course</Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-8 @lg:grid-cols-2">
        {courses.map((course) => (
          <AdminCourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
};

export default AdminCoursesPage;
