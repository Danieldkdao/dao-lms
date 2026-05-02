"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LessonConfigForm } from "./lesson-config-form";
import { LessonTable } from "@/db/schema";

export const LessonConfiguration = ({
  courseId,
  lesson,
}: {
  courseId: string;
  lesson: typeof LessonTable.$inferSelect;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lesson Configuration</CardTitle>
        <CardDescription>
          Configure the video and description for this lesson.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LessonConfigForm courseId={courseId} lesson={lesson} />
      </CardContent>
    </Card>
  );
};
