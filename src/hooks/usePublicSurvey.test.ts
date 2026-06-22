import { deriveState } from './usePublicSurvey';
import PublicSurveyState from '../shared/enums/PublicSurveyState';

describe('usePublicSurvey deriveState', () => {
  it('returns Loading while the query is loading', () => {
    expect(deriveState({ isLoading: true, isError: false, error: undefined, hasData: false })).toBe(
      PublicSurveyState.Loading,
    );
  });

  it('returns NotFound for a 404 error', () => {
    const error = { response: { status: 404 } };
    expect(deriveState({ isLoading: false, isError: true, error, hasData: false })).toBe(
      PublicSurveyState.NotFound,
    );
  });

  it('returns Error for a non-404 error', () => {
    const error = { response: { status: 500 } };
    expect(deriveState({ isLoading: false, isError: true, error, hasData: false })).toBe(
      PublicSurveyState.Error,
    );
  });

  it('returns NotFound when not loading/erroring but no data arrived', () => {
    expect(deriveState({ isLoading: false, isError: false, error: undefined, hasData: false })).toBe(
      PublicSurveyState.NotFound,
    );
  });

  it('returns Ready when data is present', () => {
    expect(deriveState({ isLoading: false, isError: false, error: undefined, hasData: true })).toBe(
      PublicSurveyState.Ready,
    );
  });

  it('returns Closed when data is present but the survey is closed', () => {
    expect(
      deriveState({ isLoading: false, isError: false, error: undefined, hasData: true, isClosed: true }),
    ).toBe(PublicSurveyState.Closed);
  });

  it('returns Ready when data is present and not closed (explicit false)', () => {
    expect(
      deriveState({ isLoading: false, isError: false, error: undefined, hasData: true, isClosed: false }),
    ).toBe(PublicSurveyState.Ready);
  });
});
