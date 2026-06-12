import React from 'react';

import { useLocalSearchParams } from 'expo-router';

import PublicSurveyScreen from '../../../../src/features/questioner/components/PublicSurveyScreen';

const WILDCARD_ORIGIN = '*';

/**
 * Embeddable, anonymous survey route: `/public/survey/embed/{externalId}`.
 *
 * Renders {@link PublicSurveyScreen} in embed mode (drops chrome, posts
 * `survey-widget-resize` messages to the parent window). Framing is permitted by the
 * erevna-web nginx `/public/survey/` carve-out (X-Frame-Options cleared,
 * `frame-ancestors *`). Mirrors the menu embed route 1:1.
 */
const SurveyEmbedRoute = (): React.ReactElement => {
  const params = useLocalSearchParams<{ id: string; origin?: string }>();
  const externalId = String(params.id);
  const targetOrigin = params.origin ?? WILDCARD_ORIGIN;

  return <PublicSurveyScreen embedMode externalId={externalId} targetOrigin={targetOrigin} />;
};

export default SurveyEmbedRoute;
