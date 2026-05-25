/**
 * Maps the erevna-web resolved theme onto the `AuthTheme` token bag that
 * `@dloizides/auth-web` components are styled against.
 *
 * `@dloizides/auth-web` owns no brand — each consuming app supplies its own
 * theme as a flat token bag (`AuthTheme`). This is the erevna → `AuthTheme`
 * adapter: it picks the tokens the auth components actually read out of the
 * tenant-themeable `ResolvedTheme` so the package's `<LoginForm>` /
 * `<ForgotPasswordForm>` / `<ResetPasswordForm>` render on-brand.
 *
 * Mirrors the katalogos-web mapper at `apps/katalogos-web/src/auth/authThemeMapping.ts`
 * — both apps share the same `ResolvedTheme` shape (palette + semantic) and
 * pick the same six colour tokens. Kept as separate per-app files (not a
 * shared package) so each app can drift independently if needed.
 *
 * The numeric tokens (radii / spacing / typography) deliberately mirror
 * `defaultAuthTheme` — those values match the legacy hand-rolled auth screens
 * so the unified-auth port is a visual no-op.
 */
import { defaultAuthTheme, type AuthTheme } from '@dloizides/auth-web';

import type { ResolvedTheme } from '../theme/types/resolvedTheme';

/** Text colour drawn on top of the brand primary (submit-button label). */
const ON_PRIMARY_COLOR = '#ffffff';

/**
 * Build an `AuthTheme` from the app's resolved tenant theme.
 *
 * Colours come from the live `ResolvedTheme` so the auth surfaces follow the
 * tenant's palette and the light/dark mode. Radii, spacing and typography reuse
 * `defaultAuthTheme` — those numeric values already match the legacy auth
 * screens, so adopting them is a visual no-op.
 */
export function mapAppThemeToAuthTheme(theme: ResolvedTheme): AuthTheme {
  return {
    colors: {
      background: theme.colors.background,
      surface: theme.colors.surface,
      text: theme.colors.text,
      textSecondary: theme.colors.textSecondary,
      border: theme.colors.border,
      primary: theme.palette.primary['500'],
      onPrimary: ON_PRIMARY_COLOR,
      danger: theme.semantic.error['500'],
      success: theme.semantic.success['500'],
    },
    radii: defaultAuthTheme.radii,
    spacing: defaultAuthTheme.spacing,
    typography: defaultAuthTheme.typography,
  };
}
