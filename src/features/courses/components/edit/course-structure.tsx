import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CourseTable } from "@/db/schema";

export const CourseStructure = ({
  course,
}: {
  course: typeof CourseTable.$inferSelect;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Structure</CardTitle>
        <CardDescription>
          Here you can update your course structure
        </CardDescription>
      </CardHeader>
      <CardContent>course structure</CardContent>
    </Card>
  );
};
