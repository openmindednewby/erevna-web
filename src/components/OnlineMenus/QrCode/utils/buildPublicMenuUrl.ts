import { Platform } from 'react-native';

export function buildPublicMenuUrl(externalId: string): string {
  const baseUrl = Platform.OS === 'web' ? window.location.origin : '';
  return `${baseUrl}/public/menu/${externalId}`;
}
