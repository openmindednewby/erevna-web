import { BFF_API_BASE } from './bffRoutes';
import { createHttpClient, type OrvalRequest, type OrvalMutator } from './createHttpClient';

export type { OrvalRequest, OrvalMutator };

export const notificationInstance = createHttpClient({
  baseURL: BFF_API_BASE.notifications,
  withCredentials: true,
});

export default notificationInstance;
