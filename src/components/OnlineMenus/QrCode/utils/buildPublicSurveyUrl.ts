import { Platform } from 'react-native';

/**
 * Builds the public survey URL for a given survey/template external ID.
 * On web, uses the current origin; on native, returns a relative path.
 * Mirrors {@link buildPublicMenuUrl}.
 */
export function buildPublicSurveyUrl(externalId: string): string {
  const baseUrl = Platform.OS === 'web' ? window.location.origin : '';
  return `${baseUrl}/public/survey/${externalId}`;
}
