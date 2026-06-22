/**
 * usePublicSurvey - orchestration hook for the public, anonymous survey screen.
 *
 * Wires the public template fetch + public submit mutation into the existing
 * pure fill stack (`useQuizForm`) and derives the screen state the route needs.
 */
import { useMemo } from 'react';

import { useQuizForm } from './quiz';
import { FM } from '../localization/helpers';
import { usePublicQuestionerTemplate } from '../server/customHooks/usePublicQuestionerTemplate';
import { usePublicSubmitResponse } from '../server/customHooks/usePublicSubmitResponse';
import PublicSurveyState from '../shared/enums/PublicSurveyState';
import { isValueDefined } from '../utils/is';
import { isNotFoundError } from '../utils/isNotFoundError';

interface UsePublicSurveyResult {
  state: PublicSurveyState;
  quizForm: ReturnType<typeof useQuizForm>;
  refetch: () => Promise<unknown>;
}

/** Inputs for deriving the public survey screen state. */
interface DeriveStateParams {
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  hasData: boolean;
  /** Survey exists and is active but no longer accepting responses (date/quota). */
  isClosed?: boolean;
}

/** Derives the screen state from the template query result. */
// ts-prune-ignore-next -- exported for unit testing the screen-state logic
export function deriveState({ isLoading, isError, error, hasData, isClosed = false }: DeriveStateParams): PublicSurveyState {
  if (isLoading) return PublicSurveyState.Loading;
  if (isError) return isNotFoundError(error) ? PublicSurveyState.NotFound : PublicSurveyState.Error;
  if (!hasData) return PublicSurveyState.NotFound;
  if (isClosed) return PublicSurveyState.Closed;
  return PublicSurveyState.Ready;
}

export function usePublicSurvey(externalId: string): UsePublicSurveyResult {
  const { data, isLoading, isError, error, refetch } = usePublicQuestionerTemplate(externalId);
  const submitResponse = usePublicSubmitResponse(externalId);

  const quizForm = useQuizForm(data ?? undefined, submitResponse, refetch, FM);

  const isClosed = isValueDefined(data) && data.acceptingResponses === false;
  const state = useMemo(
    () => deriveState({ isLoading, isError, error, hasData: isValueDefined(data), isClosed }),
    [isLoading, isError, error, data, isClosed],
  );

  return { state, quizForm, refetch };
}
