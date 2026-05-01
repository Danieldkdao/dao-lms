"use client";

import { LessonTable } from "@/db/schema";
import { DragDropProvider, type DragEndEvent } from "@dnd-kit/react";
import { isSortableOperation } from "@dnd-kit/react/sortable";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SortableLesson } from "./sortable-lesson";

type Lesson = typeof LessonTable.$inferSelect;

const moveItem = <T,>(items: T[], from: number, to: number) => {
  const nextItems = [...items];
  const [movedItem] = nextItems.splice(from, 1);

  if (!movedItem) {
    return items;
  }

  nextItems.splice(to, 0, movedItem);

  return nextItems;
};

export const ChapterLessonsDnd = ({
  chapterId,
  lessons,
}: {
  chapterId: string;
  lessons: Lesson[];
}) => {
  const [orderedLessons, setOrderedLessons] = useState(lessons);

  useEffect(() => {
    setOrderedLessons(lessons);
  }, [lessons]);

  // useEffect(() => {
  //   handleReorderChapters(orderedChapters);
  // }, [orderedChapters]);

  const handleDragEnd: DragEndEvent = async (event) => {
    if (event.canceled) {
      return;
    }

    if (!isSortableOperation(event.operation)) {
      return;
    }

    const { source } = event.operation;

    if (!source) {
      return;
    }

    const { initialIndex, index } = source;

    if (initialIndex === index) {
      return;
    }

    setOrderedLessons((currentChapters) =>
      moveItem(currentChapters, initialIndex, index),
    );
  };

  // const handleReorderChapters = async (orderChapters: ChapterWithLessons[]) => {
  //   const response = await reorderChapters(courseId, orderChapters);
  //   if (response.error) {
  //     toast.error(response.message);
  //     console.log;
  //   }
  // };

  return (
    <DragDropProvider onDragEnd={handleDragEnd}>
      <div className="flex flex-col gap-2">
        {orderedLessons.map((lesson, index) => (
          <SortableLesson
            key={lesson.id}
            lesson={lesson}
            chapterId={chapterId}
            index={index}
          />
        ))}
      </div>
    </DragDropProvider>
  );
};
