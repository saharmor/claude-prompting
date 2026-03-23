/**
 * Anthropic model identifiers used for grading.
 * Update these before deploying when a model snapshot is deprecated.
 */
export const GRADING_MODEL = "claude-sonnet-4-6";

/** Maximum characters allowed in a user-submitted prompt. */
export const MAX_PROMPT_LENGTH = 10_000;

/**
 * Cache reusable grading prompt prefixes for a short period.
 * Anthropic refreshes the 5-minute TTL on reads, which is a good fit for retry loops.
 */
export const GRADING_PROMPT_CACHE_TTL = "5m";

/** Grading API call timeout in milliseconds. */
export const GRADING_TIMEOUT_MS = 25_000;
