import { isNotFoundError } from './isNotFoundError';

describe('isNotFoundError', () => {
  it('returns true for an axios-like 404 error', () => {
    expect(isNotFoundError({ response: { status: 404 } })).toBe(true);
  });

  it('returns false for other status codes', () => {
    expect(isNotFoundError({ response: { status: 500 } })).toBe(false);
    expect(isNotFoundError({ response: { status: 401 } })).toBe(false);
  });

  it('returns false when there is no response', () => {
    expect(isNotFoundError({ message: 'Network error' })).toBe(false);
  });

  it('returns false for non-object errors', () => {
    expect(isNotFoundError(null)).toBe(false);
    expect(isNotFoundError(undefined)).toBe(false);
    expect(isNotFoundError('404')).toBe(false);
  });
});
