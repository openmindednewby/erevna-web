import { BFF_API_BASE } from './bffRoutes';
import { createHttpClient, type OrvalRequest, type OrvalMutator } from './createHttpClient';

export type { OrvalRequest, OrvalMutator };

export const identityInstance = createHttpClient({
  baseURL: BFF_API_BASE.tenants,
  withCredentials: true,
});

export default identityInstance;
