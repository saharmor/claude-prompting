"use client";

import { useEffect, useState } from "react";
import { getChapterProgress } from "@/lib/progress/storage";

interface Props {
  chapterSlug: string;
  exerciseIds: string[];
}

export function ChapterProgress({ chapterSlug, exerciseIds }: Props) {
  const [progress, setProgress] = useState<{
    completed: number;
    total: number;
  } | null>(null);

  // Stringify the array so the effect only re-runs when the IDs actually change,
  // not every time the parent re-renders with a new array reference.
  const exerciseIdsKey = exerciseIds.join(",");
  useEffect(() => {
    setProgress(getChapterProgress(chapterSlug, exerciseIds));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapterSlug, exerciseIdsKey]);

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
