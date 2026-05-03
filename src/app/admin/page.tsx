import { ChartAreaInteractive } from "@/components/dashboard/chart-area-interactive";

import { SectionCards } from "@/components/dashboard/section-cards";
import { NoPermission } from "@/components/no-permission";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getRecentCourses } from "@/features/courses/actions/actions";
import { AdminCourseCard } from "@/features/courses/components/admin-course.card";
import { getDashboardData } from "@/lib/actions";
import { requireAdminPermission } from "@/lib/auth/permissions";
import { BookIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

const AdminDashboardPage = () => {
  return (
    <div className="space-y-4">
      <Suspense fallback={<AdminDashboardDataLoading />}>
        <AdminDashboardDataSuspense />
      </Suspense>
      <div className="flex flex-col gap-8 p-10">
        <div className="flex items-center gap-2 flex-wrap justify-between">
          <h1 className="text-3xl font-bold">Recent Courses</h1>
          <Button variant="outline" asChild>
            <Link href="/admin/courses">View All Courses</Link>
          </Button>
        </div>
        <Suspense fallback={<AdminDashboardRecentLoading />}>
          <AdminDashboardRecentSuspense />
        </Suspense>
      </div>
    </div>
  );
};

const AdminDashboardDataLoading = () => {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card
            className="@container/card bg-linear-to-t from-primary/5 to-card shadow-xs"
            key={index}
          >
            <CardHeader>
              <div className="flex items-center gap-2 justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-28" />
                  <Skeleton className="h-9 w-20" />
                </div>
                <Skeleton className="size-8 rounded-md" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-5 w-full max-w-64" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="px-4 lg:px-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-5 w-full max-w-80" />
          </CardHeader>
          <CardContent>
            <div className="w-full overflow-hidden">
              <div className="h-[400px] w-full min-w-300 rounded-md border p-4">
                <div className="flex h-full items-end gap-3">
                  {Array.from({ length: 30 }).map((_, index) => (
                    <Skeleton
                      className="flex-1 rounded-t-sm"
                      key={index}
                      style={{ height: `${24 + ((index * 17) % 70)}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const AdminDashboardDataSuspense = async () => {
  if (!(await requireAdminPermission())) {
    return <NoPermission />;
  }

  const dashboardData = await getDashboardData();

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <SectionCards {...dashboardData} />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive
          data={dashboardData.enrollmentChartData}
          totalEnrollmentsLast30Days={dashboardData.totalEnrollmentsLast30Days}
        />
      </div>
    </div>
  );
};

const AdminDashboardRecentLoading = () => {
  return (
    <div className="grid grid-cols-1 gap-8 @lg:grid-cols-2">
      {Array.from({ length: 2 }).map((_, index) => (
        <AdminCourseCardSkeleton key={index} />
      ))}
    </div>
  );
};

const AdminCourseCardSkeleton = () => {
  return (
    <Card className="p-0">
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
  );
};

const AdminDashboardRecentSuspense = async () => {
  if (!(await requireAdminPermission())) {
    return <NoPermission />;
  }
  const recentCourses = await getRecentCourses();

  return recentCourses.length ? (
    <div className="grid grid-cols-1 gap-8 @lg:grid-cols-2">
      {recentCourses.map((course) => (
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

export default AdminDashboardPage;
