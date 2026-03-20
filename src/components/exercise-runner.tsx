"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FeedbackPanel } from "@/components/feedback-panel";
import { ModelAnswer } from "@/components/model-answer";
import { saveAttempt, getAttempt } from "@/lib/progress/storage";
import type { Exercise, GradeResult } from "@/lib/curriculum/schema";

interface Props {
  exercise: Exercise;
  chapterSlug: string;
}

export function ExerciseRunner({ exercise, chapterSlug }: Props) {
  const [prompt, setPrompt] = useState(exercise.starterPrompt ?? "");
  const [isGrading, setIsGrading] = useState(false);
  const [result, setResult] = useState<GradeResult | null>(null);
  const [showHints, setShowHints] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastAttemptPassed, setLastAttemptPassed] = useState<boolean | null>(null);

  useEffect(() => {
    const prev = getAttempt(chapterSlug, exercise.id);
    if (prev) {
      setLastAttemptPassed(prev.passed);
    }
  }, [chapterSlug, exercise.id]);

  async function handleSubmit() {
    if (!prompt.trim()) return;

    setIsGrading(true);
    setError(null);
    setResult(null);

    try {
      const apiKey = getApiKey();
      if (!apiKey) {
        setError(
          "Please set your Anthropic API key first. Click the gear icon in the top-right corner."
        );
        setIsGrading(false);
        return;
      }

      const res = await fetch("/api/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exerciseId: exercise.id,
          chapterSlug,
          userPrompt: prompt,
          apiKey,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `Grading failed (${res.status})`);
      }

      const data: GradeResult = await res.json();
      setResult(data);
      setLastAttemptPassed(data.passed);

      saveAttempt({
        exerciseId: exercise.id,
        chapterSlug,
        passed: data.passed,
        score: data.score,
        submittedAt: new Date().toISOString(),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsGrading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Previous attempt indicator */}
      {lastAttemptPassed !== null && !result && (
        <div
          className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm ${
            lastAttemptPassed
              ? "bg-success/10 text-success"
              : "bg-muted text-muted-foreground"
          }`}
        >
          <span>{lastAttemptPassed ? "\u2713" : "\u25CB"}</span>
          {lastAttemptPassed
            ? "You previously passed this exercise."
            : "You attempted this exercise before. Try again!"}
        </div>
      )}

      {/* Prompt Editor */}
      <div>
        <label htmlFor="prompt-editor" className="mb-1.5 block text-sm font-medium">
          Your Prompt
        </label>
        <Textarea
          id="prompt-editor"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Write your prompt here..."
          className="min-h-[160px] font-mono text-sm bg-card resize-y"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button onClick={handleSubmit} disabled={isGrading || !prompt.trim()}>
          {isGrading ? "Grading..." : "Submit for Grading"}
        </Button>
        <button
          onClick={() => setShowHints(!showHints)}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {showHints ? "Hide hints" : "Show hints"}
        </button>
      </div>

      {/* Hints */}
      {showHints && exercise.hints.length > 0 && (
        <div className="rounded-lg border border-border bg-muted/50 p-4">
          <p className="mb-2 text-sm font-medium">Hints</p>
          <ul className="flex flex-col gap-1.5 text-sm text-muted-foreground">
            {exercise.hints.map((hint, idx) => (
              <li key={idx} className="flex gap-2">
                <span className="text-primary shrink-0">&#8226;</span>
                {hint}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Feedback */}
      {result && <FeedbackPanel result={result} />}

      {/* Model Answer */}
      <ModelAnswer answer={exercise.modelAnswer} />
    </div>
  );
}

function getApiKey(): string | null {
  if (typeof window === "undefined") return null;
  // sessionStorage takes priority (session-only save); fall back to persistent localStorage
  return (
    sessionStorage.getItem("anthropic_api_key") ||
    localStorage.getItem("anthropic_api_key") ||
    null
  );
}
