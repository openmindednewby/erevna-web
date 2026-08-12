/**
 * The build id this bundle is running — surfaced by the `BuildInfoFooter` so any operator (or us,
 * over their shoulder) can read which build is live without opening dev tools.
 *
 * Expo only inlines `EXPO_PUBLIC_*` env into the client bundle, so CI stamps
 * `EXPO_PUBLIC_BUILD_VERSION` (the same git sha it hands `@dloizides/pwa-sw`'s `PWA_BUILD_VERSION`
 * for the service-worker cache key — one id, both places). A local `expo start` with nothing set
 * falls back to `dev`.
 */
import { isNotEmptyString } from '../utils/is';

const FALLBACK_BUILD_VERSION = 'dev';

/** The stamped build id, or `dev` when unset (local runs). */
export function buildVersion(): string {
  // Direct literal access so Metro/Babel inlines the value at build time — indirect access
  // (`const p = process.env; p.EXPO_PUBLIC_BUILD_VERSION`) is NOT statically analysable and
  // ships an undefined runtime read in the browser (see environment.ts for the same pattern).
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const stamped: string | undefined = process.env.EXPO_PUBLIC_BUILD_VERSION;
  return isNotEmptyString(stamped) ? stamped : FALLBACK_BUILD_VERSION;
}
