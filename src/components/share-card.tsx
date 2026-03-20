"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { isAllComplete } from "@/lib/progress/storage";
import { chapters } from "@/lib/curriculum/data";

export function ShareCard() {
  const [complete, setComplete] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const allChapters = chapters.map((c) => ({
      slug: c.slug,
      exerciseIds: c.exercises.map((e) => e.id),
    }));
    setComplete(isAllComplete(allChapters));
  }, []);

  if (!complete) return null;

  const totalExercises = chapters.reduce((s, c) => s + c.exercises.length, 0);
  const totalChapters = chapters.length;
  const shareText = `I completed the PromptCraft course — all ${totalExercises} exercises across ${totalChapters} chapters of Claude prompt engineering! 🎯\n\nPractice your prompting skills too:`;

  async function handleCopyText() {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not available in this context
    }
  }

  function handleShareTwitter() {
    const url = encodeURIComponent(window.location.origin);
    const text = encodeURIComponent(shareText);
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  function handleShareLinkedIn() {
    const url = encodeURIComponent(window.location.origin);
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  return (
    <div className="mx-auto max-w-md my-8">
      <div className="relative overflow-hidden rounded-xl border-2 border-primary/30 bg-card p-6 text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent-blue/5" />
        <div className="relative">
          <div className="mb-3 text-4xl">&#127942;</div>
          <h3 className="text-xl font-bold">Course Complete!</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            You finished all {totalExercises} exercises across {totalChapters}{" "}
            chapters of Claude prompt engineering.
          </p>

          <div className="mt-4 flex flex-col gap-2">
            <div className="flex gap-2 justify-center">
              <Button onClick={handleShareTwitter} variant="outline" size="sm">
                Share on X
              </Button>
              <Button onClick={handleShareLinkedIn} variant="outline" size="sm">
                Share on LinkedIn
              </Button>
            </div>
            <button
              onClick={handleCopyText}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {copied ? "Copied!" : "Copy share text"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
