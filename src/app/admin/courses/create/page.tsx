import { BackButton } from "@/components/back-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CourseForm } from "@/features/courses/components/course-form";

const CreateCoursePage = () => {
  return (
    <div className="p-10 space-y-8">
      <div className="flex items-center gap-4">
        <BackButton href="/admin/courses" />
        <h1 className="text-3xl font-semibold">Create Course</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Provide some basic information about the course.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CourseForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateCoursePage;
