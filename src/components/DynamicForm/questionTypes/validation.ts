import { isValueDefined } from '../../../utils/is';

import type { Answer, Question } from '../interfaces';

/** Localized message templates supplied by the caller (resolved via FM()). */
export interface ValidationMessages {
  required: string;
  minLength: string;
  maxLength: string;
  pattern: string;
  min: string;
  max: string;
  minSelections: string;
  maxSelections: string;
}

const SINGLE_PARAM_TOKEN = '{{p1}}';

function formatMessage(template: string, param: number): string {
  return template.replace(SINGLE_PARAM_TOKEN, String(param));
}

/** True when a required answer is absent/blank/empty. */
export function isRequiredAnswerMissing(answer: Answer | undefined): boolean {
  if (!isValueDefined(answer)) return true;
  if (answer === '') return true;
  if (Array.isArray(answer)) return answer.length === 0;
  return false;
}

function validateText(value: string, rules: Question['validationRules'], messages: ValidationMessages): string | undefined {
  if (!isValueDefined(rules)) return undefined;

  const tooShort = isValueDefined(rules.minLength) && value.length < rules.minLength;
  if (tooShort) return formatMessage(messages.minLength, rules.minLength ?? 0);

  const tooLong = isValueDefined(rules.maxLength) && value.length > rules.maxLength;
  if (tooLong) return formatMessage(messages.maxLength, rules.maxLength ?? 0);

  if (isValueDefined(rules.pattern) && rules.pattern !== '') {
    const matches = safeRegexTest(rules.pattern, value);
    if (!matches) return resolvePatternMessage(rules, messages);
  }

  return undefined;
}

function resolvePatternMessage(rules: NonNullable<Question['validationRules']>, messages: ValidationMessages): string {
  const custom = rules.patternMessage;
  return isValueDefined(custom) && custom !== '' ? custom : messages.pattern;
}

function safeRegexTest(pattern: string, value: string): boolean {
  try {
    return new RegExp(pattern).test(value);
  } catch {
    return true;
  }
}

function validateNumeric(value: number, rules: Question['validationRules'], messages: ValidationMessages): string | undefined {
  if (!isValueDefined(rules)) return undefined;

  const belowMin = isValueDefined(rules.min) && value < rules.min;
  if (belowMin) return formatMessage(messages.min, rules.min ?? 0);

  const aboveMax = isValueDefined(rules.max) && value > rules.max;
  if (aboveMax) return formatMessage(messages.max, rules.max ?? 0);

  return undefined;
}

function validateSelections(values: Array<string | number>, rules: Question['validationRules'], messages: ValidationMessages): string | undefined {
  if (!isValueDefined(rules)) return undefined;

  const tooFew = isValueDefined(rules.minSelections) && values.length < rules.minSelections;
  if (tooFew) return formatMessage(messages.minSelections, rules.minSelections ?? 0);

  const tooMany = isValueDefined(rules.maxSelections) && values.length > rules.maxSelections;
  if (tooMany) return formatMessage(messages.maxSelections, rules.maxSelections ?? 0);

  return undefined;
}

/** Dispatch validation by the JS runtime shape of the answer. */
export function validateByShape(answer: Answer, rules: Question['validationRules'], messages: ValidationMessages): string | undefined {
  if (typeof answer === 'string') return validateText(answer, rules, messages);
  if (typeof answer === 'number') return validateNumeric(answer, rules, messages);
  if (Array.isArray(answer)) {
    const selections = answer.filter((v): v is string | number => typeof v === 'string' || typeof v === 'number');
    return validateSelections(selections, rules, messages);
  }
  return undefined;
}
