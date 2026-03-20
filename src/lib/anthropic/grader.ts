import Anthropic from "@anthropic-ai/sdk";
import { Exercise, GradeResult } from "@/lib/curriculum/schema";
import { buildGradingPrompt } from "./rubrics";
import { GRADING_MODEL, GRADING_TIMEOUT_MS } from "./config";

export async function gradeSubmission(
  exercise: Exercise,
  userPrompt: string,
  apiKey: string
): Promise<GradeResult> {
  const client = new Anthropic({ apiKey });
  const { systemPrompt, userPrompt: gradingMessage } = buildGradingPrompt(
    exercise,
    userPrompt
  );

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), GRADING_TIMEOUT_MS);

  let response: Awaited<ReturnType<typeof client.messages.create>>;
  try {
    response = await client.messages.create(
      {
        model: GRADING_MODEL,
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: "user", content: gradingMessage }],
      },
      { signal: controller.signal }
    );
  } finally {
    clearTimeout(timeoutId);
  }

  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from grading model");
  }

  const raw = textBlock.text.trim();
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Could not parse grading response as JSON");
  }

  const parsed = JSON.parse(jsonMatch[0]);

  const rawScore =
    typeof parsed.score === "number" ? parsed.score : 0;
  const score = Math.min(100, Math.max(0, Math.round(rawScore)));
  const passed =
    parsed.passed === true || score >= 70;

  return {
    passed,
    score,
    feedback:
      typeof parsed.feedback === "string" && parsed.feedback.trim()
        ? parsed.feedback.trim()
        : "No feedback provided.",
    strengths: Array.isArray(parsed.strengths)
      ? (parsed.strengths as unknown[]).filter((s): s is string => typeof s === "string")
      : [],
    improvements: Array.isArray(parsed.improvements)
      ? (parsed.improvements as unknown[]).filter((s): s is string => typeof s === "string")
      : [],
  };
}
