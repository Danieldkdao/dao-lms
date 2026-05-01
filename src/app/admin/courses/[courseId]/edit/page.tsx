import { NoPermission } from "@/components/no-permission";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCourse } from "@/features/courses/actions/actions";
import { CourseBasicInfo } from "@/features/courses/components/edit/course-basic-info";
import { CourseStructure } from "@/features/courses/components/edit/course-structure";
import { requireAdminPermission } from "@/lib/auth/permissions";
import { Suspense } from "react";

type CourseEditParamsType = {
  params: Promise<{ courseId: string }>;
};

const CourseEditPage = (props: CourseEditParamsType) => {
  return (
    <Suspense fallback={<CourseEditLoading />}>
      <CourseEditSuspense {...props} />
    </Suspense>
  );
};

const CourseEditLoading = () => {
  return <div>loading</div>;
};

const CourseEditSuspense = async ({ params }: CourseEditParamsType) => {
  if (!(await requireAdminPermission())) {
    return <NoPermission />;
  }
  const { courseId } = await params;
  const course = await getCourse(courseId);
  if (!course) {
    return <div>Course not found</div>;
  }

  return (
    <div className="p-10 space-y-8">
      <h1 className="text-4xl font-semibold">
        Edit Course:{" "}
        <span className="text-primary underline">{course.title}</span>
      </h1>
      <Tabs>
        <TabsList className="w-full" defaultValue="basic-info" defaultChecked>
          <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
          <TabsTrigger value="course-structure">Course Structure</TabsTrigger>
        </TabsList>
        <TabsContent value="basic-info">
          <CourseBasicInfo course={course} />
        </TabsContent>
        <TabsContent value="course-structure">
          <CourseStructure course={course} chapters={course.chapters} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CourseEditPage;
