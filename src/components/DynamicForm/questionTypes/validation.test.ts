/**
 * Tests for the dynamic-form answer validation logic.
 */
import { isRequiredAnswerMissing, validateByShape, type ValidationMessages } from './validation';
import QuestionType from '../../../shared/enums/QuestionType';

import type { Question } from '../interfaces';

const MESSAGES: ValidationMessages = {
  required: 'required',
  minLength: 'min length {{p1}}',
  maxLength: 'max length {{p1}}',
  pattern: 'pattern',
  min: 'min {{p1}}',
  max: 'max {{p1}}',
  minSelections: 'min sel {{p1}}',
  maxSelections: 'max sel {{p1}}',
};

function question(rules: Question['validationRules']): Question {
  return { id: 'q', name: 'Q', type: QuestionType.Text, page: 1, order: 1, validationRules: rules };
}

describe('validation - isRequiredAnswerMissing', () => {
  it('treats undefined / empty string / empty array as missing', () => {
    expect(isRequiredAnswerMissing(undefined)).toBe(true);
    expect(isRequiredAnswerMissing('')).toBe(true);
    expect(isRequiredAnswerMissing([])).toBe(true);
  });

  it('treats 0, false and non-empty values as present', () => {
    expect(isRequiredAnswerMissing(0)).toBe(false);
    expect(isRequiredAnswerMissing(false)).toBe(false);
    expect(isRequiredAnswerMissing('x')).toBe(false);
    expect(isRequiredAnswerMissing(['x'])).toBe(false);
  });
});

describe('validation - text rules', () => {
  it('flags strings shorter than minLength with substituted param', () => {
    expect(validateByShape('ab', question({ minLength: 3 }).validationRules, MESSAGES)).toBe('min length 3');
  });

  it('flags strings longer than maxLength', () => {
    expect(validateByShape('abcd', question({ maxLength: 3 }).validationRules, MESSAGES)).toBe('max length 3');
  });

  it('passes strings within length bounds', () => {
    expect(validateByShape('abc', question({ minLength: 1, maxLength: 5 }).validationRules, MESSAGES)).toBeUndefined();
  });

  it('uses the custom patternMessage when provided', () => {
    const rules = { pattern: '^\\d+$', patternMessage: 'digits only' };
    expect(validateByShape('abc', rules, MESSAGES)).toBe('digits only');
  });

  it('falls back to the generic pattern message when none provided', () => {
    expect(validateByShape('abc', { pattern: '^\\d+$' }, MESSAGES)).toBe('pattern');
  });

  it('passes a string matching the pattern', () => {
    expect(validateByShape('123', { pattern: '^\\d+$' }, MESSAGES)).toBeUndefined();
  });

  it('does not block on an invalid regex pattern', () => {
    expect(validateByShape('anything', { pattern: '(' }, MESSAGES)).toBeUndefined();
  });
});

describe('validation - numeric rules', () => {
  it('flags values below min', () => {
    expect(validateByShape(2, { min: 5 }, MESSAGES)).toBe('min 5');
  });

  it('flags values above max', () => {
    expect(validateByShape(20, { max: 10 }, MESSAGES)).toBe('max 10');
  });

  it('passes values within range', () => {
    expect(validateByShape(7, { min: 5, max: 10 }, MESSAGES)).toBeUndefined();
  });
});

describe('validation - selection rules', () => {
  it('flags fewer than minSelections', () => {
    expect(validateByShape(['a'], { minSelections: 2 }, MESSAGES)).toBe('min sel 2');
  });

  it('flags more than maxSelections', () => {
    expect(validateByShape(['a', 'b', 'c'], { maxSelections: 2 }, MESSAGES)).toBe('max sel 2');
  });

  it('passes selection counts within bounds', () => {
    expect(validateByShape(['a', 'b'], { minSelections: 1, maxSelections: 3 }, MESSAGES)).toBeUndefined();
  });
});

describe('validation - no rules', () => {
  it('returns undefined when no rules are defined', () => {
    expect(validateByShape('anything', undefined, MESSAGES)).toBeUndefined();
    expect(validateByShape(5, undefined, MESSAGES)).toBeUndefined();
  });
});
