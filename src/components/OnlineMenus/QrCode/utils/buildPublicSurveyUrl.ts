import { Platform } from 'react-native';

export function buildPublicSurveyUrl(externalId: string): string {
  const baseUrl = Platform.OS === 'web' ? window.location.origin : '';
  return `${baseUrl}/public/survey/${externalId}`;
}
