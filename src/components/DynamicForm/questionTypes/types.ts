import type React from 'react';

import type { ApiQuestionTypeValue } from './apiTypes';
import type { ValidationMessages } from './validation';
import type QuestionType from '../../../shared/enums/QuestionType';
import type { FormStyles } from '../../../theme/utils/styles';
import type { Answer, Question, QuestionConfig } from '../interfaces';

/** Uniform props handed to every registry renderer. */
export interface QuestionRenderProps {
  question: Question;
  value: Answer;
  errorMsg?: string;
  updateAnswer: (value: Answer) => void;
  styles: FormStyles;
  /** Survey external id — required by the file-upload renderer's public upload call. */
  surveyExternalId?: string;
}

/** A single question-type definition. */
export interface QuestionTypeEntry {
  uiType: QuestionType;
  apiType: ApiQuestionTypeValue;
  labelKey: string;
  supportsOptions: boolean;
  defaultConfig?: QuestionConfig;
  render: (props: QuestionRenderProps) => React.ReactElement | null;
  /** Returns a localized error message, or undefined when valid. */
  validate?: (answer: Answer | undefined, question: Question, messages: ValidationMessages) => string | undefined;
}
