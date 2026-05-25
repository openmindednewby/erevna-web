/**
 * Client-side password policy that mirrors the IdentityService
 * `ResetPasswordRequestValidator`:
 *
 * - 8 ≤ length ≤ 128
 * - at least one uppercase letter
 * - at least one lowercase letter
 * - at least one digit
 *
 * Single source of truth for both the reset-password screen and any future
 * password-input forms. Mirrors backend validation so 99% of bad passwords
 * fail in the UI before hitting the network.
 */
import { PasswordPolicyError } from './passwordPolicyError';

const UPPERCASE_REGEX = /[A-Z]/;
const LOWERCASE_REGEX = /[a-z]/;
const DIGIT_REGEX = /\d/;

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;

export function validatePasswordPolicy(password: string): PasswordPolicyError[] {
  const errors: PasswordPolicyError[] = [];
  if (password.length < PASSWORD_MIN_LENGTH) errors.push(PasswordPolicyError.TooShort);
  if (password.length > PASSWORD_MAX_LENGTH) errors.push(PasswordPolicyError.TooLong);
  if (!UPPERCASE_REGEX.test(password)) errors.push(PasswordPolicyError.MissingUppercase);
  if (!LOWERCASE_REGEX.test(password)) errors.push(PasswordPolicyError.MissingLowercase);
  if (!DIGIT_REGEX.test(password)) errors.push(PasswordPolicyError.MissingDigit);
  return errors;
}

export function isPasswordValid(password: string): boolean {
  return validatePasswordPolicy(password).length === 0;
}
