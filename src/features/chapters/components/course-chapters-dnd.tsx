"use client";

import { ChapterTable, LessonTable } from "@/db/schema";
import { DragDropProvider, type DragEndEvent } from "@dnd-kit/react";
import { isSortableOperation } from "@dnd-kit/react/sortable";
import { useEffect, useState } from "react";
import { SortableChapter } from "./sortable-chapter";
import { reorderChapters } from "../actions/actions";
import { toast } from "sonner";

type ChapterWithLessons = typeof ChapterTable.$inferSelect & {
  lessons: (typeof LessonTable.$inferSelect)[];
};

const moveItem = <T,>(items: T[], from: number, to: number) => {
  const nextItems = [...items];
  const [movedItem] = nextItems.splice(from, 1);

  if (!movedItem) {
    return items;
  }

  nextItems.splice(to, 0, movedItem);

  return nextItems;
};

export const CourseChaptersDnd = ({
  courseId,
  chapters,
}: {
  courseId: string;
  chapters: ChapterWithLessons[];
}) => {
  const [orderedChapters, setOrderedChapters] = useState(chapters);

  useEffect(() => {
    setOrderedChapters(chapters);
  }, [chapters]);

  useEffect(() => {
    handleReorderChapters(orderedChapters);
  }, [orderedChapters]);

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

    setOrderedChapters((currentChapters) =>
      moveItem(currentChapters, initialIndex, index),
    );
  };

  const handleReorderChapters = async (orderChapters: ChapterWithLessons[]) => {
    const response = await reorderChapters(courseId, orderChapters);
    if (response.error) {
      toast.error(response.message);
      console.log;
    }
  };

  return (
    <DragDropProvider onDragEnd={handleDragEnd}>
      <div className="flex flex-col gap-2">
        {orderedChapters.map((chapter, index) => (
          <SortableChapter key={chapter.id} chapter={chapter} index={index} />
        ))}
      </div>
    </DragDropProvider>
  );
};
