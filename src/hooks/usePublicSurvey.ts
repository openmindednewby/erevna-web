import { useCallback, useMemo, useRef, useState } from 'react';

import { useQuizForm } from './quiz';
import { useSurveyDraftSave } from './useSurveyDraftSave';
import { mergeDraftIntoTemplate } from '../features/questioner/utils/mergeDraftAnswers';
import {
  collectsRespondentContact,
  toRespondentContactMode,
  validateRespondentContact,
} from '../features/questioner/utils/respondentContact';
import { FM } from '../localization/helpers';
import { useGetDraft } from '../server/customHooks/useGetDraft';
import { usePublicQuestionerTemplate } from '../server/customHooks/usePublicQuestionerTemplate';
import { usePublicSubmitResponse } from '../server/customHooks/usePublicSubmitResponse';
import PublicSurveyState from '../shared/enums/PublicSurveyState';
import { isValueDefined } from '../utils/is';
import { isNotFoundError } from '../utils/isNotFoundError';

import type { SurveyDraftSave } from './useSurveyDraftSave';
import type { RespondentContactError } from '../features/questioner/utils/respondentContact';
import type { RespondentContact } from '../server/customHooks/usePublicSubmitResponse';
import type RespondentContactMode from '../shared/enums/RespondentContactMode';

interface RespondentContactState {
  mode: RespondentContactMode;
  collects: boolean;
  name: string;
  email: string;
  setName: (v: string) => void;
  setEmail: (v: string) => void;
  error: RespondentContactError;
}

interface UsePublicSurveyResult {
  state: PublicSurveyState;
  quizForm: ReturnType<typeof useQuizForm>;
  refetch: () => Promise<unknown>;
  contact: RespondentContactState;
  draftSave: SurveyDraftSave;
}

interface DeriveStateParams {
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  hasData: boolean;
  isClosed?: boolean;
}

/** Derives the screen state from the template query result. */
export function deriveState({ isLoading, isError, error, hasData, isClosed = false }: DeriveStateParams): PublicSurveyState {
  if (isLoading) return PublicSurveyState.Loading;
  if (isError) return isNotFoundError(error) ? PublicSurveyState.NotFound : PublicSurveyState.Error;
  if (!hasData) return PublicSurveyState.NotFound;
  if (isClosed) return PublicSurveyState.Closed;
  return PublicSurveyState.Ready;
}

interface RespondentContactHook {
  contact: RespondentContactState;
  getRespondent: () => RespondentContact | undefined;
  validateExtra: () => boolean;
}

function useRespondentContact(mode: RespondentContactMode): RespondentContactHook {
  const collects = collectsRespondentContact(mode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<RespondentContactError>(null);
  const ref = useRef<RespondentContact>({});
  ref.current = { name, email };
  const getRespondent = useCallback(
    (): RespondentContact | undefined => (collects ? ref.current : undefined),
    [collects],
  );
  const validateExtra = useCallback((): boolean => {
    if (!collects) return true;
    const err = validateRespondentContact(mode, name, email);
    setError(err);
    return !isValueDefined(err);
  }, [collects, mode, name, email]);
  const setNameSafe = useCallback((v: string) => { setName(v); setError(null); }, []);
  const setEmailSafe = useCallback((v: string) => { setEmail(v); setError(null); }, []);
  const contact = useMemo<RespondentContactState>(
    () => ({ mode, collects, name, email, setName: setNameSafe, setEmail: setEmailSafe, error }),
    [mode, collects, name, email, error, setNameSafe, setEmailSafe],
  );
  return { contact, getRespondent, validateExtra };
}

export function usePublicSurvey(externalId: string, draftToken = ''): UsePublicSurveyResult {
  const { data, isLoading, isError, error, refetch } = usePublicQuestionerTemplate(externalId);
  const draft = useGetDraft(draftToken);
  const mergedData = useMemo(
    () => mergeDraftIntoTemplate(data, draft.data?.contents?.questions),
    [data, draft.data],
  );
  const mode = toRespondentContactMode(data?.respondentContactMode);
  const { contact, getRespondent, validateExtra } = useRespondentContact(mode);

  const submitResponse = usePublicSubmitResponse(externalId, getRespondent);
  const quizOptions = useMemo(() => ({ t: FM, validateExtra }), [validateExtra]);
  const quizForm = useQuizForm(mergedData ?? undefined, submitResponse, refetch, quizOptions);
  const draftSave = useSurveyDraftSave(externalId, draftToken);

  const isClosed = isValueDefined(data) && data.acceptingResponses === false;
  const state = useMemo(
    () => deriveState({ isLoading, isError, error, hasData: isValueDefined(data), isClosed }),
    [isLoading, isError, error, data, isClosed],
  );

  return { state, quizForm, refetch, contact, draftSave };
}
