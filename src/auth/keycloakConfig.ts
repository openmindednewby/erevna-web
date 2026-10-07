import { parseRealmFromIssuer } from '@dloizides/auth-client';

import env from '../config/environment';

export const keycloakConfig = {
  issuer: env.KEYCLOAK_ISSUER,
  clientId: env.KEYCLOAK_CLIENT_ID,
  redirectUri: env.KEYCLOAK_REDIRECT_URI,
  scopes: env.KEYCLOAK_SCOPES.split(' '),
};

export const keycloakRealm: string | null = parseRealmFromIssuer(env.KEYCLOAK_ISSUER);
