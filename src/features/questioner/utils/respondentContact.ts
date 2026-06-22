import RespondentContactMode from '@/shared/enums/RespondentContactMode';

/**
 * Pure client-side mirror of the backend RespondentContactValidator. Returns a
 * stable error key ('name' | 'email') for the first problem, or null when the
 * contact is acceptable for the given mode. Anonymous never errors; Optional only
 * checks email shape when one is entered; Required demands both name and a valid
 * email.
 */

// Deliberately permissive shape check (matches the backend's intent).
const EMAIL_SHAPE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export type RespondentContactError = 'name' | 'email' | null;

export function validateRespondentContact(
  mode: RespondentContactMode,
  name: string,
  email: string,
): RespondentContactError {
  if (mode === RespondentContactMode.Anonymous) return null;

  const trimmedName = name.trim();
  const trimmedEmail = email.trim();
  const hasEmail = trimmedEmail !== '';

  if (mode === RespondentContactMode.Required) {
    if (trimmedName === '') return 'name';
    if (!hasEmail) return 'email';
  }

  if (hasEmail && !EMAIL_SHAPE.test(trimmedEmail)) return 'email';

  return null;
}

/** Whether the given mode collects respondent identity at all. */
export function collectsRespondentContact(mode: RespondentContactMode | undefined): boolean {
  return mode === RespondentContactMode.Optional || mode === RespondentContactMode.Required;
}

/** Narrows a raw numeric/nullable API value to a known RespondentContactMode. */
export function toRespondentContactMode(value: number | null | undefined): RespondentContactMode {
  if (value === RespondentContactMode.Optional) return RespondentContactMode.Optional;
  if (value === RespondentContactMode.Required) return RespondentContactMode.Required;
  return RespondentContactMode.Anonymous;
}
