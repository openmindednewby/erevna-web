/**
 * Returns true when the given (unknown) error is an HTTP 404 response.
 *
 * Used by the public survey route to distinguish a "survey not available"
 * state (closed/missing -> friendly screen) from a generic load error.
 * Reads the Axios error's `response.status` without importing axios types.
 */

import { isValueDefined } from './is';

const HTTP_NOT_FOUND = 404;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && isValueDefined(value);
}

export function isNotFoundError(error: unknown): boolean {
  if (!isRecord(error)) return false;
  const response = error.response;
  if (!isRecord(response)) return false;
  return response.status === HTTP_NOT_FOUND;
}
