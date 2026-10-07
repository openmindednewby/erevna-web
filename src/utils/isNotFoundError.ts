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
