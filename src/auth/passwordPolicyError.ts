/**
 * Single-error tag for password-policy violations.
 *
 * Lives in its own file so consumers (UI screens, validators) can import the
 * enum without dragging the regex helpers in `passwordPolicy.ts` along — and
 * to satisfy the project-wide `enum-file-isolation` rule.
 */
export const enum PasswordPolicyError {
  TooShort = 'tooShort',
  TooLong = 'tooLong',
  MissingUppercase = 'missingUppercase',
  MissingLowercase = 'missingLowercase',
  MissingDigit = 'missingDigit',
}
