import {
  additionalProblemRecords,
  sampleProblemRecords,
} from "@/lib/practice/additional-problems";
import clientEmail from "@/lib/practice/problems/problem_client_email.json";
import dataExtraction from "@/lib/practice/problems/problem_data_extraction.json";
import structuredReasoning from "@/lib/practice/problems/problem_structured_reasoning.json";
import toolSimulation from "@/lib/practice/problems/problem_tool_simulation.json";
import type { Problem } from "@/lib/practice/types";
import { hydrateProblem } from "@/lib/practice/utils";

const seedProblemRecords = [
  ...sampleProblemRecords,
  {
    ...clientEmail,
    difficulty: "beginner",
  },
  {
    ...dataExtraction,
    difficulty: "beginner",
  },
  {
    ...structuredReasoning,
    difficulty: "intermediate",
  },
  {
    ...toolSimulation,
    difficulty: "advanced",
  },
  ...additionalProblemRecords,
];

export function getSeedProblems(): Problem[] {
  return seedProblemRecords.map((problem) => hydrateProblem(problem));
}
