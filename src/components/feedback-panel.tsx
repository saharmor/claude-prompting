"use client";

import type { GradeResult } from "@/lib/curriculum/schema";

interface Props {
  result: GradeResult;
}

export function FeedbackPanel({ result }: Props) {
  return (
    <div
      className={`rounded-lg border p-5 ${
        result.passed
          ? "border-success/30 bg-success/5"
          : "border-destructive/30 bg-destructive/5"
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <span
          className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white ${
            result.passed ? "bg-success" : "bg-destructive"
          }`}
        >
          {result.passed ? "\u2713" : "\u2717"}
        </span>
        <span className="font-semibold">
          {result.passed ? "Passed" : "Not quite"}
        </span>
        <span className="ml-auto text-sm text-muted-foreground">
          Score: {result.score}/100
        </span>
      </div>

      {result.simulatedOutput && (
        <div className="mb-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Simulated Claude Output
          </p>
          <pre className="overflow-x-auto whitespace-pre-wrap rounded-md border border-border/60 bg-background/70 p-3 text-sm leading-relaxed">
            {result.simulatedOutput}
          </pre>
        </div>
      )}

      {/* Feedback */}
      <p className="mb-4 text-sm leading-relaxed">{result.feedback}</p>

      {/* Strengths */}
      {result.strengths.length > 0 && (
        <div className="mb-3">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-success">
            What you did well
          </p>
          <ul className="flex flex-col gap-1 text-sm">
            {result.strengths.map((s, idx) => (
              <li key={idx} className="flex gap-2">
                <span className="text-success shrink-0">+</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Improvements */}
      {result.improvements.length > 0 && (
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-primary">
            How to improve
          </p>
          <ul className="flex flex-col gap-1 text-sm">
            {result.improvements.map((i, idx) => (
              <li key={idx} className="flex gap-2">
                <span className="text-primary shrink-0">&#8594;</span>
                {i}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
