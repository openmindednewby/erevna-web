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
