import { createBrowserStore } from "@/lib/browser-storage";
import { ProgressData, ExerciseAttempt, CURRENT_VERSION } from "./types";

export const PROGRESS_STORAGE_KEY = "promptcraft_progress";
export const PROGRESS_CHANGE_EVENT = "promptcraft-progress-change";
const progressStore = createBrowserStore(
  PROGRESS_STORAGE_KEY,
  PROGRESS_CHANGE_EVENT
);

function getExerciseKey(chapterSlug: string, exerciseId: string): string {
  return `${chapterSlug}/${exerciseId}`;
}

function createEmpty(): ProgressData {
  return { __version: CURRENT_VERSION, attempts: {}, submittedPrompts: {} };
}

function normalizeProgress(data: ProgressData): ProgressData {
  return {
    __version: CURRENT_VERSION,
    attempts: data.attempts ?? {},
    submittedPrompts: data.submittedPrompts ?? {},
  };
}

function saveProgress(data: ProgressData): void {
  progressStore.write(data);
}

export function loadProgress(): ProgressData {
  const data = progressStore.read<ProgressData | null>(null);
  if (!data || data.__version !== CURRENT_VERSION) {
    return createEmpty();
  }

  return normalizeProgress(data);
}

export function saveAttempt(attempt: ExerciseAttempt): void {
  const data = loadProgress();
  const key = getExerciseKey(attempt.chapterSlug, attempt.exerciseId);

  data.attempts[key] = attempt;

  saveProgress(data);
}

export function getAttempt(
  chapterSlug: string,
  exerciseId: string
): ExerciseAttempt | null {
  const data = loadProgress();
  return data.attempts[getExerciseKey(chapterSlug, exerciseId)] ?? null;
}

export function saveSubmittedPrompt(
  chapterSlug: string,
  exerciseId: string,
  prompt: string
): void {
  const data = loadProgress();
  data.submittedPrompts[getExerciseKey(chapterSlug, exerciseId)] = prompt;
  saveProgress(data);
}

export function getSubmittedPrompt(
  chapterSlug: string,
  exerciseId: string
): string | null {
  const data = loadProgress();
  return data.submittedPrompts[getExerciseKey(chapterSlug, exerciseId)] ?? null;
}

export function getChapterProgress(
  chapterSlug: string,
  exerciseIds: string[]
): { completed: number; total: number; allPassed: boolean } {
  const data = loadProgress();
  let completed = 0;

  for (const id of exerciseIds) {
    const attempt = data.attempts[getExerciseKey(chapterSlug, id)];
    if (attempt?.passed) completed++;
  }

  return {
    completed,
    total: exerciseIds.length,
    allPassed: completed === exerciseIds.length,
  };
}

export function isAllComplete(
  chapters: { slug: string; exerciseIds: string[] }[]
): boolean {
  const data = loadProgress();

  for (const ch of chapters) {
    for (const id of ch.exerciseIds) {
      const attempt = data.attempts[getExerciseKey(ch.slug, id)];
      if (!attempt?.passed) return false;
    }
  }

  return true;
}

export function resetProgress(): void {
  progressStore.remove();
}

export function subscribeToProgressStorage(callback: () => void) {
  return progressStore.subscribe(callback);
}
