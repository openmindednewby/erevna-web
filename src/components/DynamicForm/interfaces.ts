import type QuestionType from '../../shared/enums/QuestionType';

export interface DynamicQuiz {
  id: string;
  name: string;
  description?: string;
  questions: Question[];
}

export interface Question {
  id: string;
  name: string;
  type: QuestionType;
  options?: Option[];
  page: number;
  answer?: Answer;
  isRequired?: boolean;
  skipConditions?: SkipCondition[];
  order: number;
  validationRules?: ValidationRules;
  config?: QuestionConfig;
}

/** UI mirror of the backend ValidationRules contract (all optional). */
export interface ValidationRules {
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  patternMessage?: string;
  min?: number;
  max?: number;
  minSelections?: number;
  maxSelections?: number;
}

/** UI mirror of the backend QuestionConfig contract (all optional). */
export interface QuestionConfig {
  scaleMin?: number;
  scaleMax?: number;
  scaleStep?: number;
  minLabel?: string;
  maxLabel?: string;
  allowedContentTypes?: string[];
  maxSizeBytes?: number;
  maxFiles?: number;
}

/** A stored-file reference (not the bytes) that a file-upload answer holds. */
export interface FileReference {
  objectKey: string;
  fileName: string;
  contentType: string;
  sizeBytes: number;
}

export { default as QuestionType } from '../../shared/enums/QuestionType';
export type Answer = boolean | string | number | Array<string | number> | FileReference[];

export interface Option {
  value: string | number;
  label: string;
}

export interface SkipCondition {
  questionId: string;
  questionAnswer: boolean | string | number;
}
