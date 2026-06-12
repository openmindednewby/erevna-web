import type { ReactElement } from 'react';

import { Stack } from 'expo-router';

import LazyQueryProvider from '../../../../src/components/Providers/LazyQueryProvider';

/** Minimal layout for the embeddable survey — no auth, no Notifier, no analytics. */
const SurveyEmbedLayout = (): ReactElement => (
  <LazyQueryProvider>
    <Stack screenOptions={{ headerShown: false }} />
  </LazyQueryProvider>
);

export default SurveyEmbedLayout;
