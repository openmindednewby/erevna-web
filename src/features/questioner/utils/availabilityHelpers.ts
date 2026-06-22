/**
 * Pure helpers for the survey availability fields (soft-closing date + response
 * quota) edited in the template editor. Kept framework-free so they can be unit
 * tested in isolation and reused by the editor's save path.
 */

/** Length of the date-only (YYYY-MM-DD) prefix of an ISO timestamp. */
const DATE_ONLY_LENGTH = 10;
/** Smallest allowed response quota. */
const MIN_QUOTA = 1;

/**
 * Converts a date-only input (`YYYY-MM-DD`) to an end-of-day UTC ISO string so
 * the survey stays open through the whole chosen day. Returns null for an empty
 * or unparseable input.
 */
export function toClosingDateIso(dateInput: string | null | undefined): string | null {
  const trimmed = (dateInput ?? '').trim();
  if (trimmed === '') return null;
  const parsed = new Date(`${trimmed}T23:59:59.999Z`);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString();
}

/**
 * Extracts the date-only (`YYYY-MM-DD`) portion of a stored ISO closing date for
 * display in the editor's date input. Returns '' when absent/unparseable.
 */
export function toClosingDateInput(iso: string | null | undefined): string {
  const trimmed = (iso ?? '').trim();
  if (trimmed === '') return '';
  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) return '';
  return parsed.toISOString().slice(0, DATE_ONLY_LENGTH);
}

/**
 * Normalises a max-responses text input to a positive integer, or null when the
 * input is empty or not a valid quota (≥ 1).
 */
export function toMaxResponses(input: string | null | undefined): number | null {
  const trimmed = (input ?? '').trim();
  if (trimmed === '') return null;
  const value = Number(trimmed);
  if (!Number.isInteger(value) || value < MIN_QUOTA) return null;
  return value;
}

/** Formats a stored max-responses number for the editor's number input. */
export function toMaxResponsesInput(value: number | null | undefined): string {
  return typeof value === 'number' && value >= MIN_QUOTA ? String(value) : '';
}
