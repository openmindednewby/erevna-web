import type { ReactElement } from 'react';

import { Stack } from 'expo-router';

import LazyQueryProvider from '../../../src/components/Providers/LazyQueryProvider';

/** Minimal layout for the public survey respondent route — no auth gate. */
const PublicSurveyLayout = (): ReactElement => (
  <LazyQueryProvider>
    <Stack screenOptions={{ headerShown: false }} />
  </LazyQueryProvider>
);

export default PublicSurveyLayout;
