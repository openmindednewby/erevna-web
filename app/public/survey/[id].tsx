import React from 'react';

import { useLocalSearchParams } from 'expo-router';

import PublicSurveyScreen from '../../../src/features/questioner/components/PublicSurveyScreen';

/**
 * Public, anonymous survey respondent route: `/public/survey/{externalId}`.
 * Outside the (protected) group — fillable without login.
 */
const PublicSurveyRoute = (): React.ReactElement => {
  const params = useLocalSearchParams<{ id: string; draft?: string }>();
  const externalId = String(params.id);
  const draftToken = typeof params.draft === 'string' ? params.draft : '';

  return <PublicSurveyScreen draftToken={draftToken} externalId={externalId} />;
};

export default PublicSurveyRoute;
