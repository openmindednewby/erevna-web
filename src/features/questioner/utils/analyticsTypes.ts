/** Shared result shapes for the client-side response analytics. */

/** Distribution of a single option within a choice question. */
export interface OptionDistribution {
  value: string;
  label: string;
  count: number;
  /** Percentage of total responses (0-100), guarded against divide-by-zero. */
  pct: number;
}

/** Aggregated result for one choice-type question. */
export interface ChoiceQuestionStats {
  questionId: string;
  questionName: string;
  options: OptionDistribution[];
}

/** Aggregated result for one text-type question. */
export interface TextQuestionStats {
  questionId: string;
  questionName: string;
  answers: string[];
}

/** A single numeric value bucket with its frequency. */
export interface NumericBucket {
  value: number;
  count: number;
}

/** Aggregated result for one numeric-type question (Rating/Nps/Number/LinearScale). */
export interface NumericQuestionStats {
  questionId: string;
  questionName: string;
  count: number;
  /** Mean of all answered values (0 when there are no responses). */
  average: number;
  distribution: NumericBucket[];
}

/** Aggregated result for one date-type question (collected as a list). */
export interface DateQuestionStats {
  questionId: string;
  questionName: string;
  values: string[];
}

/** A single day bucket of response counts. */
export interface ResponsesByDayEntry {
  day: string;
  count: number;
}

/** Per-type split of the template's question aggregations. */
export interface SplitQuestionStats {
  choiceQuestions: ChoiceQuestionStats[];
  textQuestions: TextQuestionStats[];
  numericQuestions: NumericQuestionStats[];
  dateQuestions: DateQuestionStats[];
}

/** Full analytics result for the active template's responses. */
export interface AnalyticsStats {
  totalResponses: number;
  responsesByDay: ResponsesByDayEntry[];
  choiceQuestions: ChoiceQuestionStats[];
  textQuestions: TextQuestionStats[];
  numericQuestions: NumericQuestionStats[];
  dateQuestions: DateQuestionStats[];
}

/** A pickable question for the crosstab row/column selectors. */
export interface CrosstabQuestionOption {
  questionId: string;
  questionName: string;
}

/** One cell of the crosstab matrix: the count of responses in (row bucket, col bucket). */
export interface CrosstabCell {
  count: number;
}

/** One row of the crosstab matrix: a row-answer bucket plus its per-column cells. */
export interface CrosstabRow {
  bucket: string;
  cells: CrosstabCell[];
  /** Row total across all column buckets. */
  total: number;
}

export interface CrosstabStats {
  rowQuestionId: string;
  rowQuestionName: string;
  colQuestionId: string;
  colQuestionName: string;
  colBuckets: string[];
  rows: CrosstabRow[];
  /** Per-column totals across all rows. */
  colTotals: number[];
  /** Number of responses that answered both questions (the joined sample size). */
  matchedResponses: number;
}

/** Answered-rate for a single question across completed responses. */
export interface FunnelQuestionStep {
  questionId: string;
  questionName: string;
  page: number;
  /** Responses where this question had a non-null/non-empty answer. */
  answered: number;
  /** Total completed responses considered. */
  total: number;
  /** answered/total * 100, guarded against divide-by-zero (0 when total is 0). */
  answeredPct: number;
}

/** Reach for a single page (how many responses had at least one answered question on it). */
export interface FunnelPageStep {
  page: number;
  /** Responses that answered at least one question on this page. */
  reached: number;
  total: number;
  reachedPct: number;
}

/** Full completion / answered-rate funnel result (NOT abandonment drop-off). */
export interface FunnelStats {
  totalResponses: number;
  questionSteps: FunnelQuestionStep[];
  pageSteps: FunnelPageStep[];
}
