"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChapterTable, CourseTable, LessonTable } from "@/db/schema";
import { CourseChaptersDnd } from "@/features/chapters/components/course-chapters-dnd";
import { NewChapterDialog } from "@/features/chapters/components/new-chapter-dialog";
import { FileIcon, PlusIcon } from "lucide-react";
import { useState } from "react";

export const CourseStructure = ({
  course,
  chapters,
}: {
  course: typeof CourseTable.$inferSelect;
  chapters: (typeof ChapterTable.$inferSelect & {
    lessons: (typeof LessonTable.$inferSelect)[];
  })[];
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <NewChapterDialog
        open={open}
        setOpen={setOpen}
        courseId={course.id}
        position={chapters.length + 1}
      />
      <Card>
        <CardHeader>
          <CardTitle>Course Structure</CardTitle>
          <CardDescription>
            Here you can update your course structure
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center gap-2 flex-wrap justify-between">
            <h3 className="text-lg font-medium">Chapters</h3>
            <Button variant="outline" onClick={() => setOpen(true)}>
              <PlusIcon />
              New Chapter
            </Button>
          </div>
          {chapters.length ? (
            <CourseChaptersDnd chapters={chapters} courseId={course.id} />
          ) : (
            <div className="w-full rounded-lg border-2 border-dashed p-10 flex flex-col items-center gap-2 justify-center">
              <FileIcon className="size-10" />
              <h1 className="text-lg font-medium">No Chapters Yet</h1>
              <p className="text-muted-foreground text-base">
                Create your first chapter to get started!
              </p>
              <Button onClick={() => setOpen(true)} className="w-full max-w-60">
                Create Chapter
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};
