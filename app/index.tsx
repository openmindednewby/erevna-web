import React, { useEffect } from 'react';

import { Platform } from 'react-native';

import { useRouter } from 'expo-router';

import { useAuth } from '../src/auth/AuthProvider';
import { BrandedHero, FaqSection, FeatureGrid, LandingLayout } from '../src/components/Landing';
import { SEOHead } from '../src/components/Shared/SEOHead';
import { FM } from '../src/localization/helpers';

import type { LandingFeature } from '../src/components/Landing/types';

const PROTECTED_ROUTE = '/(protected)';
const LOGIN_ROUTE = '/(auth)/login';

const FEATURES: readonly LandingFeature[] = [
  { titleKey: 'landing.features.f1Title', descriptionKey: 'landing.features.f1Description' },
  { titleKey: 'landing.features.f2Title', descriptionKey: 'landing.features.f2Description' },
  { titleKey: 'landing.features.f3Title', descriptionKey: 'landing.features.f3Description' },
];

const FAQ_ENTRIES = [
  { questionKey: 'landing.faq.q1Question', answerKey: 'landing.faq.q1Answer' },
  { questionKey: 'landing.faq.q2Question', answerKey: 'landing.faq.q2Answer' },
  { questionKey: 'landing.faq.q3Question', answerKey: 'landing.faq.q3Answer' },
  { questionKey: 'landing.faq.q4Question', answerKey: 'landing.faq.q4Answer' },
  { questionKey: 'landing.faq.q5Question', answerKey: 'landing.faq.q5Answer' },
  { questionKey: 'landing.faq.q6Question', answerKey: 'landing.faq.q6Answer' },
] as const;

/**
 * Erevna marketing landing — home route.
 *
 * Web visitors see the full marketing landing (hero + features + FAQ + footer).
 * Mobile platforms skip the marketing surface and route into auth or dashboard.
 *
 * Brand identity: one Erevna identity across marketing -> auth -> app — locked Outfit
 * wordmark + tagline ("From wondering to knowing.") and the single Erevna green.
 */
const RootPage = (): React.ReactElement | null => {
  const router = useRouter();
  const { isLoggedIn, loading } = useAuth();

  // Mobile apps: skip landing, go to auth or dashboard. `isLoggedIn` is the
  // post-BFF-cutover session signal (driven by `GET /bff/me`).
  useEffect(() => {
    if (Platform.OS === 'web') return;
    if (loading) return;

    if (isLoggedIn) router.replace(PROTECTED_ROUTE);
    else router.replace(LOGIN_ROUTE);
  }, [loading, router, isLoggedIn]);

  if (Platform.OS !== 'web') return null;

  return (
    <LandingLayout>
      <SEOHead
        description={FM('landing.hub.seoDescription')}
        title={FM('landing.hub.seoTitle')}
      />
      <BrandedHero
        primaryCtaHintKey="landing.hero.primaryCtaHint"
        primaryCtaKey="landing.hero.primaryCta"
        primaryCtaRoute={isLoggedIn ? PROTECTED_ROUTE : LOGIN_ROUTE}
        secondaryCtaHintKey="landing.hero.secondaryCtaHint"
        secondaryCtaKey="landing.hero.secondaryCta"
        secondaryCtaRoute="/pricing"
        subheadKey="landing.hero.subhead"
        taglineKey="landing.hero.tagline"
        wordmarkKey="landing.hero.wordmark"
      />
      <FeatureGrid features={FEATURES} sectionTitleKey="landing.features.sectionTitle" />
      <FaqSection
        entries={FAQ_ENTRIES}
        sectionTitleKey="landing.faq.sectionTitle"
        toggleHintKey="landing.faq.toggleHint"
      />
    </LandingLayout>
  );
};

export default RootPage;
