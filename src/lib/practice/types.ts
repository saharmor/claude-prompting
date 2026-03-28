export const DEFAULT_INPUT_WRAPPER_TEMPLATE = "\n\n<input>\n{input}\n</input>";

export const PRACTICE_DIFFICULTIES = [
  "beginner",
  "intermediate",
  "advanced",
] as const;

export type PracticeDifficulty = (typeof PRACTICE_DIFFICULTIES)[number];

export interface TestCase {
  id: string;
  name: string;
  input_data: string;
  expected_output: string;
  notes: string;
  hidden: boolean;
}

export interface ValidatorConfig {
  kind: string;
  label: string;
  config: Record<string, unknown>;
}

export interface Problem {
  id: string;
  title: string;
  difficulty: PracticeDifficulty;
  description: string;
  input_format: string;
  evaluator_expectation: string;
  starter_prompt: string;
  input_wrapper_template: string;
  input_variable_name: string;
  sample_cases: TestCase[];
  hidden_cases: TestCase[];
  validators: ValidatorConfig[];
  evaluator_hook: string;
  tags: string[];
  created_by_user: boolean;
}

export interface EvaluationResult {
  label: string;
  passed: boolean;
  details: string;
  issues: string[];
  kind: string;
}

export interface HiddenSuiteResult {
  case_id: string;
  name: string;
  passed: boolean;
  error: string;
  evaluation: EvaluationResult[];
}

export interface RunResult {
  run_id: string;
  created_at: string;
  problem_id: string;
  problem_title: string;
  provider: "anthropic";
  model_name: string;
  prompt_markdown: string;
  runtime_prompt: string;
  input_data: string;
  case_id: string;
  output_text: string;
  formatted_output: string;
  duration_seconds: number;
  evaluation: EvaluationResult[];
  hidden_suite: HiddenSuiteResult[];
  error: string;
  input_tokens?: number | null;
  output_tokens?: number | null;
  cache_creation_input_tokens?: number | null;
  cache_read_input_tokens?: number | null;
}

export interface PracticeConfig {
  hasAnthropicKey: boolean;
  anthropicModels: string[];
}

export interface BootstrapResponse {
  problems: Problem[];
  config: PracticeConfig;
}

export interface ProviderResponse {
  outputText: string;
  durationSeconds: number;
  error?: string;
  inputTokens?: number | null;
  outputTokens?: number | null;
  cacheCreationInputTokens?: number | null;
  cacheReadInputTokens?: number | null;
}
