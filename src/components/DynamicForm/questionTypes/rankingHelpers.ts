/**
 * Pure ordering helpers for the Ranking question type.
 *
 * A Ranking answer reuses the existing `multiValues` array as an ORDERED list of the
 * question's option values — no backend Answer change. The respondent reorders the
 * options; the stored order IS the ranking (index 0 = most preferred).
 */
import type { Option } from '../interfaces';

/**
 * Resolve the current ranked order of option values.
 *
 * Starts from any previously-stored order (`current`), keeps only values that still
 * exist as options, then appends any options not yet ranked (in their declared order).
 * Guarantees the result is a permutation of the option values.
 */
export function resolveRankedOrder(
  options: Option[],
  current: Array<string | number> | undefined,
): string[] {
  const optionValues = options.map((option) => String(option.value));
  const valueSet = new Set(optionValues);
  const seen = new Set<string>();
  const ordered: string[] = [];

  if (Array.isArray(current))
    for (const raw of current) {
      const value = String(raw);
      if (valueSet.has(value) && !seen.has(value)) {
        ordered.push(value);
        seen.add(value);
      }
    }

  for (const value of optionValues)
    if (!seen.has(value)) ordered.push(value);

  return ordered;
}

/** Move the item at `index` one step toward the start (no-op at the top). */
export function moveUp(order: string[], index: number): string[] {
  if (index <= 0 || index >= order.length) return order;
  return swap(order, index, index - 1);
}

/** Move the item at `index` one step toward the end (no-op at the bottom). */
export function moveDown(order: string[], index: number): string[] {
  if (index < 0 || index >= order.length - 1) return order;
  return swap(order, index, index + 1);
}

function swap(order: string[], a: number, b: number): string[] {
  const next = [...order];
  const temp = next[a];
  next[a] = next[b];
  next[b] = temp;
  return next;
}

/** Map ranked option values back to their labels (value used when no label found). */
export function labelForValue(options: Option[], value: string): string {
  const match = options.find((option) => String(option.value) === value);
  return match?.label ?? value;
}
