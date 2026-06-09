import { buildPublicSurveyUrl } from './buildPublicSurveyUrl';

jest.mock('react-native', () => ({
  Platform: { OS: 'web' },
}));

describe('buildPublicSurveyUrl', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      value: { origin: 'https://example.com' },
      writable: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true,
    });
  });

  it('constructs URL with origin and survey external ID', () => {
    const result = buildPublicSurveyUrl('abc-123');
    expect(result).toBe('https://example.com/public/survey/abc-123');
  });

  it('handles empty ID gracefully', () => {
    const result = buildPublicSurveyUrl('');
    expect(result).toBe('https://example.com/public/survey/');
  });
});
