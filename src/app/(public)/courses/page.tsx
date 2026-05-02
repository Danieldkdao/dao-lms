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
  return <div>loading</div>;
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
        Looks like we aren't offering any courses at the moment. Come back later
        when we drop some new courses.
      </p>
    </div>
  );
};

export default CoursesPage;
