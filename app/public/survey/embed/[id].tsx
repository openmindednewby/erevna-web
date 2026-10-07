import React from 'react';

import { useLocalSearchParams } from 'expo-router';

import PublicSurveyScreen from '../../../../src/features/questioner/components/PublicSurveyScreen';

const WILDCARD_ORIGIN = '*';

const SurveyEmbedRoute = (): React.ReactElement => {
  const params = useLocalSearchParams<{ id: string; origin?: string }>();
  const externalId = String(params.id);
  const targetOrigin = params.origin ?? WILDCARD_ORIGIN;

  return <PublicSurveyScreen embedMode externalId={externalId} targetOrigin={targetOrigin} />;
};

export default SurveyEmbedRoute;
