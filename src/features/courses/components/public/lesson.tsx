"use client";

import { LessonTable } from "@/db/schema";
import { generateImageUrl } from "@/lib/utils";
import { PlayIcon } from "lucide-react";
import { useEffect, useState } from "react";

const getVideoDuration = (url: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");

    video.preload = "metadata";
    video.src = url;

    video.onloadedmetadata = () => {
      resolve(video.duration);
    };

    video.onerror = () => {
      reject(new Error("Failed to load video metadata"));
    };
  });
};

export const Lesson = ({
  lesson,
}: {
  lesson: typeof LessonTable.$inferSelect;
}) => {
  const [videoDuration, setVideoDuration] = useState<number | null>(null);
  useEffect(() => {
    const run = async () => {
      try {
        if (!lesson.videoKey) return;
        const duration = await getVideoDuration(
          generateImageUrl(lesson.videoKey),
        );

        setVideoDuration(duration);
      } catch (err) {
        console.error(err);
      }
    };

    run();
  }, [lesson]);

  return (
    <div className="flex items-center gap-2 p-4 rounded-md hover:bg-accent">
      <div className="flex items-center gap-4 flex-1">
        <div className="size-10 shrink-0 rounded-full flex items-center justify-center bg-card/20 border">
          <PlayIcon className="size-4 text-muted-foreground" />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-medium line-clamp-1">
            {lesson.name}
          </span>
          <span className="text-base text-muted-foreground">
            Lesson {lesson.position}
          </span>
        </div>
      </div>
      <span className="text-base text-muted-foreground">
        {videoDuration ? `${Math.round(videoDuration)} minutes` : "No Video"}
      </span>
    </div>
  );
};
