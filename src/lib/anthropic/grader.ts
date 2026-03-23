import Anthropic from "@anthropic-ai/sdk";
import { Exercise, GradeResult } from "@/lib/curriculum/schema";
import { buildGradingPrompt } from "./rubrics";
import { GRADING_MODEL, GRADING_TIMEOUT_MS } from "./config";

function extractJsonObject(raw: string): string | null {
  const trimmed = raw.trim();

  try {
    JSON.parse(trimmed);
    return trimmed;
  } catch {
    // Fall through to balanced-brace extraction.
  }

  let depth = 0;
  let start = -1;
  let inString = false;
  let isEscaped = false;

  for (let index = 0; index < raw.length; index += 1) {
    const char = raw[index];

    if (inString) {
      if (isEscaped) {
        isEscaped = false;
        continue;
      }

      if (char === "\\") {
        isEscaped = true;
        continue;
      }

      if (char === '"') {
        inString = false;
      }

      continue;
    }

    if (char === '"') {
      inString = true;
      continue;
    }

    if (char === "{") {
      if (depth === 0) start = index;
      depth += 1;
      continue;
    }

    if (char === "}") {
      if (depth === 0) continue;
      depth -= 1;

      if (depth === 0 && start !== -1) {
        return raw.slice(start, index + 1);
      }
    }
  }

  return null;
}

export async function gradeSubmission(
  exercise: Exercise,
  userPrompt: string,
  apiKey: string
): Promise<GradeResult> {
  const client = new Anthropic({ apiKey });
  const { system, userMessageContent } = buildGradingPrompt(
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
        system,
        messages: [{ role: "user", content: userMessageContent }],
      },
      { signal: controller.signal }
    );
  } finally {
    clearTimeout(timeoutId);
  }

  if (process.env.NODE_ENV !== "production") {
    console.info("Grading prompt cache usage", {
      cacheCreationInputTokens: response.usage.cache_creation_input_tokens,
      cacheReadInputTokens: response.usage.cache_read_input_tokens,
      inputTokens: response.usage.input_tokens,
    });
  }

  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from grading model");
  }

  const raw = textBlock.text.trim();
  const jsonObject = extractJsonObject(raw);
  if (!jsonObject) {
    throw new Error("Could not parse grading response as JSON");
  }

  const parsed = JSON.parse(jsonObject);

  const rawScore = Number(parsed.score);
  const score = Math.min(100, Math.max(0, Math.round(rawScore)));
  const normalizedScore = Number.isFinite(score) ? score : 0;
  const passed =
    typeof parsed.passed === "boolean" ? parsed.passed : normalizedScore >= 70;

  return {
    passed,
    score: normalizedScore,
    feedback:
      typeof parsed.feedback === "string" && parsed.feedback.trim()
        ? parsed.feedback.trim()
        : "No feedback provided.",
    strengths: Array.isArray(parsed.strengths)
      ? (parsed.strengths as unknown[])
          .filter((s): s is string => typeof s === "string")
          .slice(0, 3)
      : [],
    improvements: Array.isArray(parsed.improvements)
      ? (parsed.improvements as unknown[])
          .filter((s): s is string => typeof s === "string")
          .slice(0, 3)
      : [],
    simulatedOutput:
      typeof parsed.simulated_output === "string" && parsed.simulated_output.trim()
        ? parsed.simulated_output.trim()
        : undefined,
  };
}
