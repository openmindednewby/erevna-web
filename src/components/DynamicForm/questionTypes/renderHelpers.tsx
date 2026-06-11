/**
 * Render + validation helpers for the question-type registry. Kept out of
 * `registry.tsx` so that file stays under the line limit and only holds the
 * type entries + lookups.
 */
import React from 'react';

import { isRequiredAnswerMissing, validateByShape, type ValidationMessages } from './validation';
import { isValueDefined } from '../../../utils/is';
import { CheckboxQuestion } from '../QuestionRenderer/components/CheckboxQuestion';

import type { QuestionRenderProps } from './types';
import type { FormStyles } from '../../../theme/utils/styles';
import type { Answer, Question } from '../interfaces';

/** A choice renderer (radio / dropdown) sharing the scalar-answer shape. */
type OptionComponent = React.FC<{
  value: string | number;
  errorMsg?: string;
  updateAnswer: (v: string | number) => void;
  styles: FormStyles;
  options: NonNullable<Question['options']>;
}>;

export function asNumberOrNull(value: Answer): number | null {
  return typeof value === 'number' ? value : null;
}

export function asString(value: Answer): string {
  return typeof value === 'string' ? value : '';
}

function asScalar(value: Answer): string | number {
  return typeof value === 'string' || typeof value === 'number' ? value : '';
}

function asArray(value: Answer): Array<string | number> {
  return Array.isArray(value) ? value : [];
}

/** Render a single-select (radio / dropdown) entry, or null when it has no options. */
export function renderOptionEntry(
  optionComponent: OptionComponent,
  props: QuestionRenderProps,
): React.ReactElement | null {
  const { question, value, errorMsg, updateAnswer, styles } = props;
  const options = question.options ?? [];
  if (options.length === 0) return null;
  const Component = optionComponent;
  return (
    <Component
      errorMsg={errorMsg}
      options={options}
      styles={styles}
      updateAnswer={(v: string | number) => updateAnswer(v)}
      value={asScalar(value)}
    />
  );
}

/** Render a multi-select (checkbox / multiple-choice) entry, or null when it has no options. */
export function renderMultiEntry(props: QuestionRenderProps): React.ReactElement | null {
  const { question, value, errorMsg, updateAnswer, styles } = props;
  const options = question.options ?? [];
  if (options.length === 0) return null;
  return (
    <CheckboxQuestion
      errorMsg={errorMsg}
      options={options}
      styles={styles}
      updateAnswer={(updated: Array<string | number>) => updateAnswer(updated)}
      value={asArray(value)}
    />
  );
}

/** Shared validator: required check first, then per-shape rule validation. */
export function defaultValidate(
  answer: Answer | undefined,
  question: Question,
  messages: ValidationMessages,
): string | undefined {
  if (question.isRequired === true && isRequiredAnswerMissing(answer))
    return messages.required;
  if (!isValueDefined(answer)) return undefined;
  return validateByShape(answer, question.validationRules, messages);
}
