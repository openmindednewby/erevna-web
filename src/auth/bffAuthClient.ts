import {
  BffAuthClient,
  createFetchHttpClient,
  type HttpRequest,
  type HttpResponse,
} from '@dloizides/auth-client';

import { isValueDefined } from '../utils/is';

async function lazyFetchHttpClient(request: HttpRequest): Promise<HttpResponse> {
  const fetchImpl: typeof fetch | undefined =
    typeof fetch === 'function' ? fetch.bind(globalThis) : undefined;
  if (!isValueDefined(fetchImpl)) 
    return Promise.reject(new Error('bffAuthClient: fetch is not available in this environment'));
  
  return createFetchHttpClient(fetchImpl)(request);
}

export const bffAuthClient = new BffAuthClient({ http: lazyFetchHttpClient });
