import { BFF_API_BASE } from './bffRoutes';
import { createHttpClient, type OrvalRequest, type OrvalMutator } from './createHttpClient';

export type { OrvalRequest, OrvalMutator };

export const customInstance = createHttpClient({
  baseURL: BFF_API_BASE.menus,
  withCredentials: true,
});

export default customInstance;
