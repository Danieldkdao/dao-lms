import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CourseTable } from "@/db/schema";
import { CourseForm } from "../course-form";

export const CourseBasicInfo = ({
  course,
}: {
  course: typeof CourseTable.$inferSelect;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Info</CardTitle>
        <CardDescription>
          Provide basic information about the course
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CourseForm course={course} />
      </CardContent>
    </Card>
  );
};
