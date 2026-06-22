import {
  toClosingDateInput,
  toClosingDateIso,
  toMaxResponses,
  toMaxResponsesInput,
} from './availabilityHelpers';

describe('availabilityHelpers', () => {
  describe('toClosingDateIso', () => {
    it('returns null for empty/whitespace input', () => {
      expect(toClosingDateIso('')).toBeNull();
      expect(toClosingDateIso('   ')).toBeNull();
      expect(toClosingDateIso(null)).toBeNull();
      expect(toClosingDateIso(undefined)).toBeNull();
    });

    it('converts a date to an end-of-day UTC ISO string', () => {
      expect(toClosingDateIso('2026-07-01')).toBe('2026-07-01T23:59:59.999Z');
    });

    it('returns null for an unparseable date', () => {
      expect(toClosingDateIso('not-a-date')).toBeNull();
    });
  });

  describe('toClosingDateInput', () => {
    it('extracts the YYYY-MM-DD prefix from an ISO timestamp', () => {
      expect(toClosingDateInput('2026-07-01T23:59:59.999Z')).toBe('2026-07-01');
    });

    it('returns empty string for empty/unparseable input', () => {
      expect(toClosingDateInput('')).toBe('');
      expect(toClosingDateInput(null)).toBe('');
      expect(toClosingDateInput('garbage')).toBe('');
    });
  });

  describe('toMaxResponses', () => {
    it('returns null for empty input', () => {
      expect(toMaxResponses('')).toBeNull();
      expect(toMaxResponses(null)).toBeNull();
    });

    it('returns the integer for a valid quota', () => {
      expect(toMaxResponses('100')).toBe(100);
    });

    it('returns null for zero, negative, or non-integer input', () => {
      expect(toMaxResponses('0')).toBeNull();
      expect(toMaxResponses('-5')).toBeNull();
      expect(toMaxResponses('1.5')).toBeNull();
      expect(toMaxResponses('abc')).toBeNull();
    });
  });

  describe('toMaxResponsesInput', () => {
    it('formats a valid number as a string', () => {
      expect(toMaxResponsesInput(50)).toBe('50');
    });

    it('returns empty string for null/undefined/invalid', () => {
      expect(toMaxResponsesInput(null)).toBe('');
      expect(toMaxResponsesInput(undefined)).toBe('');
      expect(toMaxResponsesInput(0)).toBe('');
    });
  });
});
