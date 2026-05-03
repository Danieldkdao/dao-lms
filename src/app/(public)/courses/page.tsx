import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getPublicCourses } from "@/features/courses/actions/actions";
import { PublicCourseCard } from "@/features/courses/components/public/public-course-card";
import { SearchXIcon } from "lucide-react";
import { Suspense } from "react";

const CoursesPage = () => {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-5xl font-semibold">Explore Courses</h1>
        <p className="text-base text-muted-foreground">
          Discover our wide range of courses designed to help you achieve your
          learning goals.
        </p>
      </div>
      <Suspense fallback={<CoursesLoading />}>
        <CoursesSuspense />
      </Suspense>
    </div>
  );
};

const CoursesLoading = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={index} className="p-0 h-full">
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

const CoursesSuspense = async () => {
  const courses = await getPublicCourses();

  return courses.length ? (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {courses.map((course) => (
        <PublicCourseCard key={course.id} course={course} />
      ))}
    </div>
  ) : (
    <div className="p-10 flex flex-col items-center justify-center w-full border-2 rounded-md border-dashed">
      <div className="size-18 rounded-full bg-primary/20 flex items-center justify-center mb-2">
        <SearchXIcon className="size-10 text-primary" />
      </div>
      <h1 className="text-xl font-medium">No Courses Offered Yet!</h1>
      <p className="text font-medium text-muted-foreground">
        Looks like we aren&apos;t offering any courses at the moment. Come back
        later when we drop some new courses.
      </p>
    </div>
  );
};

export default CoursesPage;
