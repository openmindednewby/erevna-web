import { deriveState } from './usePublicSurvey';
import PublicSurveyState from '../shared/enums/PublicSurveyState';

describe('usePublicSurvey deriveState', () => {
  it('returns Loading while the query is loading', () => {
    expect(deriveState(true, false, undefined, false)).toBe(PublicSurveyState.Loading);
  });

  it('returns NotFound for a 404 error', () => {
    const error = { response: { status: 404 } };
    expect(deriveState(false, true, error, false)).toBe(PublicSurveyState.NotFound);
  });

  it('returns Error for a non-404 error', () => {
    const error = { response: { status: 500 } };
    expect(deriveState(false, true, error, false)).toBe(PublicSurveyState.Error);
  });

  it('returns NotFound when not loading/erroring but no data arrived', () => {
    expect(deriveState(false, false, undefined, false)).toBe(PublicSurveyState.NotFound);
  });

  it('returns Ready when data is present', () => {
    expect(deriveState(false, false, undefined, true)).toBe(PublicSurveyState.Ready);
  });
});
