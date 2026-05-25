/**
 * Per-app marketing brand constants.
 *
 * Erevna — Strategy 1 (inherit BaseClient defaults), only the marketing landing
 * gets the distinct identity (Outfit wordmark + tagline). The in-app theme is untouched.
 *
 * Sourced from apps/erevna-web/brand/brand.config.json (locked 2026-05-03).
 */

/** Wordmark font family used on the marketing landing only. Latin only — falls back to system. */
export const MARKETING_WORDMARK_FONT_FAMILY =
  '"Outfit", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

/**
 * Locked preferred wordmark weight from brand.config.json (W-01 Outfit).
 * `as const` narrows the literal so it threads into RN Text fontWeight without assertions.
 */
export const MARKETING_WORDMARK_WEIGHT = '500' as const;

/** Locked letter-spacing for the wordmark (-0.02em). */
export const MARKETING_WORDMARK_LETTER_SPACING = -1.92;

/** Marketing landing canonical URL (production). */
export const MARKETING_CANONICAL_URL = 'https://erevna.dloizides.com';

/** OpenGraph site name. */
export const MARKETING_SITE_NAME = 'Erevna';

/** Default social-share image. Existing logo asset (placeholder until brand image is exported). */
export const MARKETING_OG_IMAGE = '/icons/logo-512.png';
