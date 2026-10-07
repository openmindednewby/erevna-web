import React from 'react';

import { useLocalSearchParams } from 'expo-router';

import PublicSurveyScreen from '../../../src/features/questioner/components/PublicSurveyScreen';

const PublicSurveyRoute = (): React.ReactElement => {
  const params = useLocalSearchParams<{ id: string; draft?: string }>();
  const externalId = String(params.id);
  const draftToken = typeof params.draft === 'string' ? params.draft : '';

  return <PublicSurveyScreen draftToken={draftToken} externalId={externalId} />;
};

export default PublicSurveyRoute;
