import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  isPasswordValid,
  validatePasswordPolicy,
} from './passwordPolicy';
import { PasswordPolicyError } from './passwordPolicyError';

describe('passwordPolicy', () => {
  describe('validatePasswordPolicy', () => {
    it('returns no errors for a strong password', () => {
      expect(validatePasswordPolicy('Str0ngPass!')).toEqual([]);
    });

    it('reports too-short passwords', () => {
      const errors = validatePasswordPolicy('Ab1');
      expect(errors).toContain(PasswordPolicyError.TooShort);
    });

    it('reports too-long passwords', () => {
      const longPassword = `${'A'.repeat(PASSWORD_MAX_LENGTH + 1)}b1`;
      const errors = validatePasswordPolicy(longPassword);
      expect(errors).toContain(PasswordPolicyError.TooLong);
    });

    it('reports missing uppercase', () => {
      const errors = validatePasswordPolicy('lowercase1');
      expect(errors).toContain(PasswordPolicyError.MissingUppercase);
    });

    it('reports missing lowercase', () => {
      const errors = validatePasswordPolicy('UPPERCASE1');
      expect(errors).toContain(PasswordPolicyError.MissingLowercase);
    });

    it('reports missing digit', () => {
      const errors = validatePasswordPolicy('NoDigitsHere');
      expect(errors).toContain(PasswordPolicyError.MissingDigit);
    });

    it('returns multiple errors when several rules fail', () => {
      const errors = validatePasswordPolicy('abc');
      expect(errors.length).toBeGreaterThanOrEqual(3);
      expect(errors).toContain(PasswordPolicyError.TooShort);
      expect(errors).toContain(PasswordPolicyError.MissingUppercase);
      expect(errors).toContain(PasswordPolicyError.MissingDigit);
    });

    it('accepts the exact minimum length when complexity rules pass', () => {
      const exactlyMin = 'Aa345678';
      expect(exactlyMin.length).toBe(PASSWORD_MIN_LENGTH);
      expect(validatePasswordPolicy(exactlyMin)).toEqual([]);
    });
  });

  describe('isPasswordValid', () => {
    it('returns true for a strong password', () => {
      expect(isPasswordValid('Str0ngPass!')).toBe(true);
    });

    it('returns false for an empty password', () => {
      expect(isPasswordValid('')).toBe(false);
    });

    it('returns false for a password missing complexity', () => {
      expect(isPasswordValid('alllowercase')).toBe(false);
    });
  });
});
