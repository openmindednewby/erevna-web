import React from 'react';

import { useLocalSearchParams } from 'expo-router';

import PublicSurveyScreen from '../../../src/features/questioner/components/PublicSurveyScreen';

/**
 * Public, anonymous survey respondent route: `/public/survey/{externalId}`.
 * Outside the (protected) group — fillable without login.
 */
const PublicSurveyRoute = (): React.ReactElement => {
  const params = useLocalSearchParams<{ id: string }>();
  const externalId = String(params.id);

  return <PublicSurveyScreen externalId={externalId} />;
};

export default PublicSurveyRoute;
