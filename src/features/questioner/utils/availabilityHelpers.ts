const DATE_ONLY_LENGTH = 10;
const MIN_QUOTA = 1;

export function toClosingDateIso(dateInput: string | null | undefined): string | null {
  const trimmed = (dateInput ?? '').trim();
  if (trimmed === '') return null;
  const parsed = new Date(`${trimmed}T23:59:59.999Z`);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString();
}

export function toClosingDateInput(iso: string | null | undefined): string {
  const trimmed = (iso ?? '').trim();
  if (trimmed === '') return '';
  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) return '';
  return parsed.toISOString().slice(0, DATE_ONLY_LENGTH);
}

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
