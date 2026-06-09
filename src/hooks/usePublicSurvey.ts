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

/** Derives the screen state from the template query result. */
// ts-prune-ignore-next -- exported for unit testing the screen-state logic
export function deriveState(
  isLoading: boolean,
  isError: boolean,
  error: unknown,
  hasData: boolean,
): PublicSurveyState {
  if (isLoading) return PublicSurveyState.Loading;
  if (isError) return isNotFoundError(error) ? PublicSurveyState.NotFound : PublicSurveyState.Error;
  if (!hasData) return PublicSurveyState.NotFound;
  return PublicSurveyState.Ready;
}

export function usePublicSurvey(externalId: string): UsePublicSurveyResult {
  const { data, isLoading, isError, error, refetch } = usePublicQuestionerTemplate(externalId);
  const submitResponse = usePublicSubmitResponse(externalId);

  const quizForm = useQuizForm(data ?? undefined, submitResponse, refetch, FM);

  const state = useMemo(
    () => deriveState(isLoading, isError, error, isValueDefined(data)),
    [isLoading, isError, error, data],
  );

  return { state, quizForm, refetch };
}
