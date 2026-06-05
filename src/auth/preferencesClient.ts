/**
 * The app's shared preferred-login-method client singleton (unified-login D5).
 *
 * Reads/writes the cross-device preferred login method through the BFF tenants
 * proxy (`/bff/api/tenants/api/v1/me/{preferences,login-method-preference}`).
 * Mirrors {@link bffAuthClient}'s lazy-`fetch` wiring so the module is
 * side-effect-free at load (SSR / prerender safe) and only touches `fetch` at
 * request time.
 *
 * `baseUrl` is omitted → same-origin, fronted by `bff-erevna`.
 */
import { createPreferencesClient, createFetchHttpClient } from '@dloizides/auth-web';

import { isValueDefined } from '../utils/is';

import type {
  PreferredMethodClient,
  HttpRequest,
  HttpResponse,
} from '@dloizides/auth-web';

/** Resolve the platform `fetch` lazily, per request — never at module load. */
async function lazyFetchHttpClient(request: HttpRequest): Promise<HttpResponse> {
  const fetchImpl: typeof fetch | undefined =
    typeof fetch === 'function' ? fetch.bind(globalThis) : undefined;
  if (!isValueDefined(fetchImpl))
    return Promise.reject(new Error('preferencesClient: fetch is not available in this environment'));

  return createFetchHttpClient(fetchImpl)(request);
}

/** Shared same-origin preferred-method client. Built once, reused by every surface. */
export const preferencesClient: PreferredMethodClient = createPreferencesClient({
  http: lazyFetchHttpClient,
});
