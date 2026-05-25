/**
 * Singleton wiring of the shared `BffAuthClient` from `@dloizides/auth-client`
 * v3 — the erevna-web auth surface after the Phase 2 BFF cutover.
 *
 * `bff-erevna` terminates authentication server-side: it does ROPC against
 * Keycloak with a confidential client, stores the tokens in a Redis vault, and
 * hands the browser only an opaque httpOnly session cookie. The SPA never
 * sees a token — there is nothing for an XSS to steal.
 *
 * Every call here is same-origin (the BFF is the front door) with
 * `credentials: 'include'`; state-changing calls carry `X-BFF-Csrf`. There is
 * no token storage, no refresh logic, no realm awareness — the BFF owns all
 * of that.
 *
 * This replaces the deleted `authClient.ts` (direct-KC `AuthClient` +
 * `CookieTokenStorage`) and the deleted `directKcAuthClient.ts` / ROPC adapter.
 */
import {
  BffAuthClient,
  createFetchHttpClient,
  type HttpRequest,
  type HttpResponse,
} from '@dloizides/auth-client';

import { isValueDefined } from '../utils/is';

/**
 * Resolve the platform's `fetch` lazily, per request.
 *
 * The package never imports `fetch` itself. We must NOT bind `fetch` at module
 * load — some non-browser environments (the Jest/jsdom test runtime) have no
 * `fetch` global, and a top-level `fetch.bind(...)` would throw the moment any
 * module transitively imports this file. Resolving it inside the request keeps
 * module load side-effect-free.
 */
async function lazyFetchHttpClient(request: HttpRequest): Promise<HttpResponse> {
  const fetchImpl: typeof fetch | undefined =
    typeof fetch === 'function' ? fetch.bind(globalThis) : undefined;
  if (!isValueDefined(fetchImpl)) 
    return Promise.reject(new Error('bffAuthClient: fetch is not available in this environment'));
  
  return createFetchHttpClient(fetchImpl)(request);
}

/**
 * Shared `BffAuthClient`. `baseUrl` is omitted → same-origin: every `/bff/*`
 * call goes to the SPA's own host, which (post-ingress-flip) is fronted by
 * `bff-erevna`.
 */
export const bffAuthClient = new BffAuthClient({ http: lazyFetchHttpClient });
