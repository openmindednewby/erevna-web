/**
 * Matrix/grid encoding helpers.
 *
 * The backend is a dumb JSON store: a question carries only `options` (label/value
 * pairs) and an `answer` whose array shape is `multiValues: string[]`. A Matrix
 * question therefore reuses BOTH without any backend change:
 *
 *  - ROWS and COLUMNS are stored in the shared `options` array, distinguished by a
 *    value prefix: row options use `row:<id>`, column options use `col:<id>`.
 *  - The ANSWER is `multiValues` of `"rowId:colId"` strings — one entry per answered
 *    row (each row picks exactly one column).
 *
 * Pure functions (no React, no i18n) so they are trivially unit-testable.
 */
import { isValueDefined } from '../../../utils/is';

/** Minimal option shape accepted by the axis extractors (UI + generated models both fit). */
interface AxisOption {
  value?: string | number | null;
  label?: string | null;
}

const ROW_PREFIX = 'row:';
const COL_PREFIX = 'col:';
const PAIR_SEPARATOR = ':';

export interface MatrixAxisItem {
  /** Stable id (the part after the `row:` / `col:` prefix). */
  id: string;
  label: string;
}

interface MatrixSelection {
  rowId: string;
  colId: string;
}

/** Build a row option value from a stable id. */
export function toRowValue(id: string): string {
  return `${ROW_PREFIX}${id}`;
}

/** Build a column option value from a stable id. */
export function toColValue(id: string): string {
  return `${COL_PREFIX}${id}`;
}

function stripPrefix(value: string, prefix: string): string | undefined {
  return value.startsWith(prefix) ? value.slice(prefix.length) : undefined;
}

/** Extract the row axis items from a question's options. */
export function getMatrixRows(options: AxisOption[] | undefined): MatrixAxisItem[] {
  return collectAxis(options, ROW_PREFIX);
}

/** Extract the column axis items from a question's options. */
export function getMatrixColumns(options: AxisOption[] | undefined): MatrixAxisItem[] {
  return collectAxis(options, COL_PREFIX);
}

function collectAxis(options: AxisOption[] | undefined, prefix: string): MatrixAxisItem[] {
  if (!Array.isArray(options)) return [];
  const items: MatrixAxisItem[] = [];
  for (const option of options) {
    const id = stripPrefix(String(option.value ?? ''), prefix);
    if (isValueDefined(id)) items.push({ id, label: option.label ?? '' });
  }
  return items;
}

/** Encode a single (row, col) selection into its `multiValues` string. */
export function encodeSelection(rowId: string, colId: string): string {
  return `${rowId}${PAIR_SEPARATOR}${colId}`;
}

/** Parse a `multiValues` answer array into row→col selections (last write per row wins). */
export function decodeSelections(values: Array<string | number> | undefined): MatrixSelection[] {
  if (!Array.isArray(values)) return [];
  const byRow = new Map<string, string>();
  for (const raw of values) {
    const text = String(raw);
    const idx = text.indexOf(PAIR_SEPARATOR);
    if (idx <= 0) continue;
    const rowId = text.slice(0, idx);
    const colId = text.slice(idx + 1);
    if (colId !== '') byRow.set(rowId, colId);
  }
  return Array.from(byRow.entries()).map(([rowId, colId]) => ({ rowId, colId }));
}

/** The column id currently selected for a row, or null when the row is unanswered. */
export function selectedColumnForRow(
  values: Array<string | number> | undefined,
  rowId: string,
): string | null {
  const match = decodeSelections(values).find((sel) => sel.rowId === rowId);
  return match?.colId ?? null;
}

/** Apply a (row → col) pick, replacing any prior pick for that row. */
export function applySelection(
  values: Array<string | number> | undefined,
  rowId: string,
  colId: string,
): string[] {
  const next = decodeSelections(values).filter((sel) => sel.rowId !== rowId);
  next.push({ rowId, colId });
  return next.map((sel) => encodeSelection(sel.rowId, sel.colId));
}
