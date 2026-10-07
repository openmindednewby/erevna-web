import { createPreferencesClient, createFetchHttpClient } from '@dloizides/auth-web';

import { isValueDefined } from '../utils/is';

import type {
  PreferredMethodClient,
  HttpRequest,
  HttpResponse,
} from '@dloizides/auth-web';

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
