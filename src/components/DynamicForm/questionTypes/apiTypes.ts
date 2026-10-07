export const API_QUESTION_TYPE = {
  Text: 0,
  MultipleChoice: 1,
  Checkbox: 2,
  Radio: 3,
  Dropdown: 4,
  Rating: 5,
  Nps: 6,
  Number: 7,
  Date: 8,
  LinearScale: 9,
  Ranking: 10,
  Matrix: 11,
  FileUpload: 12,
} as const;

/** The literal union of valid numeric API question-type values (0…12). */
export type ApiQuestionTypeValue = (typeof API_QUESTION_TYPE)[keyof typeof API_QUESTION_TYPE];

/** Numeric API types treated as numeric for analytics/aggregation. */
export const NUMERIC_API_TYPES: ReadonlySet<number> = new Set<number>([
  API_QUESTION_TYPE.Rating,
  API_QUESTION_TYPE.Nps,
  API_QUESTION_TYPE.Number,
  API_QUESTION_TYPE.LinearScale,
]);

/** API types whose presentation is driven by scale config (Rating, LinearScale, NPS). */
export const SCALE_API_TYPES: ReadonlySet<number> = new Set<number>([
  API_QUESTION_TYPE.Rating,
  API_QUESTION_TYPE.LinearScale,
  API_QUESTION_TYPE.Nps,
]);

/** NPS uses a fixed 0-10 range; only endpoint labels are configurable. */
export const FIXED_SCALE_API_TYPES: ReadonlySet<number> = new Set<number>([API_QUESTION_TYPE.Nps]);
