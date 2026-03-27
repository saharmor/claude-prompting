"use client";

import { useSyncExternalStore } from "react";
import {
  getChapterProgress,
  subscribeToProgressStorage,
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
    subscribeToProgressStorage,
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
