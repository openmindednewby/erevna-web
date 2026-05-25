/**
 * Tag of the single error a reset-password submit attempt can surface.
 *
 * Each variant maps 1:1 to a translation key under `resetPassword.errors.*`.
 * Lives in its own file per the project-wide `enum-file-isolation` rule so
 * the screen, the form hook, and any tests can share the same closed set.
 */
export const enum ResetPasswordError {
  Empty = 'empty',
  WeakPassword = 'weakPassword',
  Mismatch = 'mismatch',
  TokenInvalid = 'tokenInvalid',
  Network = 'network',
}
