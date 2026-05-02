import { NoPermission } from "@/components/no-permission";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCourse } from "@/features/courses/actions/actions";
import { CourseNotFound } from "@/features/courses/components/course-not-found";
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
  return (
    <div className="p-10 space-y-8">
      <div className="space-y-3">
        <Skeleton className="h-10 w-full max-w-96" />
        <Skeleton className="h-5 w-full max-w-64" />
      </div>

      <div className="space-y-4">
        <div className="bg-muted text-muted-foreground inline-flex h-9 w-full items-center justify-center rounded-lg p-[3px]">
          <Skeleton className="h-7 flex-1 rounded-md bg-background" />
          <Skeleton className="h-7 flex-1 rounded-md bg-background" />
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-4 w-72" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-28 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-full max-w-36" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const CourseEditSuspense = async ({ params }: CourseEditParamsType) => {
  if (!(await requireAdminPermission())) {
    return <NoPermission />;
  }
  const { courseId } = await params;
  const course = await getCourse(courseId);
  if (!course) {
    return <CourseNotFound />;
  }

  return (
    <div className="p-10 space-y-8">
      <h1 className="text-4xl font-semibold">
        Edit Course:{" "}
        <span className="text-primary underline">{course.title}</span>
      </h1>
      <Tabs defaultValue="basic-info">
        <TabsList className="w-full">
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
