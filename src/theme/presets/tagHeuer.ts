/**
 * Tag Heuer variant theme preset.
 * Values are taken directly from palette.ts tagHeuerPalette.
 * Uses green (#008d5c) and red (#ed1b2f) as primary accents.
 */
import type { TenantThemeConfig } from '../types';

export const TAG_HEUER_THEME_CONFIG: TenantThemeConfig = {
  primary: '#008d5c',
  secondary: '#ed1b2f',
  accent: '#008d5c',

  semantic: {
    success: '#008d5c',
    warning: '#ee9b00',
    error: '#ed1b2f',
    info: '#008d5c',
  },

  light: {
    background: '#ffffff',
    surface: '#f7f7f7',
    surfaceElevated: '#ffffff',
    text: '#001219',
    // WCAG AA: see src/theme/presets/default.ts — #717171 clears 4.5:1 on both
    // #ffffff (4.88:1) and the #f7f7f7 surface (4.56:1); #777777 cleared neither.
    textSecondary: '#717171',
    border: '#e6e6e6',
    divider: '#e6e6e6',
  },

  dark: {
    background: '#0b1414',
    surface: '#0f1d1b',
    surfaceElevated: '#142824',
    text: '#e9f2ef',
    textSecondary: '#a8b8b3',
    border: '#14433a',
    divider: '#14433a',
  },

  branding: {
    logoContentId: null,
    faviconContentId: null,
    presetId: 'tagHeuer',
  },
};
