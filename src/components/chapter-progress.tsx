"use client";

import { useSyncExternalStore } from "react";
import {
  getChapterProgress,
  PROGRESS_CHANGE_EVENT,
} from "@/lib/progress/storage";

interface Props {
  chapterSlug: string;
  exerciseIds: string[];
}

function serializeProgress(snapshot: {
  completed: number;
  total: number;
  allPassed: boolean;
}) {
  return `${snapshot.completed}|${snapshot.total}|${snapshot.allPassed ? "1" : "0"}`;
}

export function ChapterProgress({ chapterSlug, exerciseIds }: Props) {
  const progressSnapshot = useSyncExternalStore(
    (callback) => {
      if (typeof window === "undefined") return () => {};

      const handleChange = (event: Event) => {
        if (
          event instanceof StorageEvent &&
          event.key !== null &&
          event.key !== "promptcraft_progress"
        ) {
          return;
        }

        callback();
      };

      window.addEventListener("storage", handleChange);
      window.addEventListener(PROGRESS_CHANGE_EVENT, handleChange);

      return () => {
        window.removeEventListener("storage", handleChange);
        window.removeEventListener(PROGRESS_CHANGE_EVENT, handleChange);
      };
    },
    () => serializeProgress(getChapterProgress(chapterSlug, exerciseIds)),
    () => serializeProgress(getChapterProgress(chapterSlug, exerciseIds))
  );
  const [completedRaw, totalRaw] = progressSnapshot.split("|");
  const progress = {
    completed: Number(completedRaw),
    total: Number(totalRaw),
  };

  if (!progress || progress.completed === 0) return null;

  const allDone = progress.completed === progress.total;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
        allDone
          ? "bg-success/15 text-success"
          : "bg-primary/10 text-primary"
      }`}
    >
      {allDone ? (
        <>&#10003; Complete</>
      ) : (
        <>
          {progress.completed}/{progress.total}
        </>
      )}
    </span>
  );
}
