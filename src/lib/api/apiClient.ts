/**
 * BFF axios client + interceptor wiring for erevna-web.
 *
 * The axios factory and the interceptor chain (logging, success-toast
 * normalizer, error classifier) live in the shared
 * `@dloizides/bff-web-client` package. This module supplies the app-owned
 * **ports**: the CSRF strategy (`registerCsrfInterceptor`), the session-expiry
 * handler (`registerSessionExpiryInterceptor`, which owns the Redux session
 * store + the `/bff/me` probe), the logger, and the toast emitter (the app's
 * `apiEventBus`).
 */

import { createBffAxiosClient, registerInterceptors } from '@dloizides/bff-web-client';
import { notifyWarming } from '@dloizides/ui-feedback';

import { apiEventBus } from './events/apiEventBus';
import { registerCsrfInterceptor } from './interceptors/csrfInterceptor';
import { registerSessionExpiryInterceptor } from './sessionExpiry';
import { HTTP_TIMEOUT_MS } from '../../shared/constants';
import { logger } from '../../utils/logger';

import type { ErrorSeverity } from '@dloizides/api-client-base';
import type { AxiosInstance } from 'axios';

export const apiClient: AxiosInstance = createBffAxiosClient({ timeoutMs: HTTP_TIMEOUT_MS });

/**
 * Registers the full BFF interceptor chain on the provided instance, wiring the
 * app-owned CSRF + session-expiry ports, logger, and toast emitter.
 */
function registerAllInterceptors(instance: AxiosInstance): void {
  registerInterceptors(instance, {
    logger,
    emitToast: (message: string, severity: ErrorSeverity) =>
      apiEventBus.emit({ type: 'toast', severity, message }),
    csrf: registerCsrfInterceptor,
    onSessionExpiry: registerSessionExpiryInterceptor,
    // Surface the branded cold-start "warming up…" overlay while the warmup
    // interceptor retries transient 502/503/504s (UX Move 3a). The overlay
    // auto-settles a short grace period after the last retry.
    warmupRetry: { onWarmupRetry: (info) => notifyWarming(info) },
  });
}

export { registerAllInterceptors };
