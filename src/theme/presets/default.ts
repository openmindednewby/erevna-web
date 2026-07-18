/**
 * Default theme preset.
 * Values are taken directly from palette.ts basePalette to ensure
 * the app looks identical before any tenant customization is applied.
 */
import type { TenantThemeConfig } from '../types';

export const DEFAULT_THEME_CONFIG: TenantThemeConfig = {
  primary: '#005f73',
  secondary: '#94d2bd',
  accent: '#008d5c',

  semantic: {
    success: '#0a9396',
    warning: '#ee9b00',
    error: '#ae2012',
    info: '#005f73',
  },

  light: {
    background: '#ffffff',
    surface: '#f7f7f7',
    surfaceElevated: '#ffffff',
    text: '#001219',
    // WCAG AA: #777777 measured 4.48:1 on #ffffff and 4.18:1 on the #f7f7f7 surface,
    // below the 4.5:1 floor for normal text. #717171 clears both (4.88:1 / 4.56:1).
    // Mirrors the same fix in @dloizides/theme-web 1.2.0 — this app resolves its theme
    // from THIS preset, not from the package's DEFAULT_THEME_CONFIG, so it needs its own.
    textSecondary: '#717171',
    border: '#e6e6e6',
    divider: '#e6e6e6',
  },

  dark: {
    background: '#001219',
    surface: '#052f33',
    surfaceElevated: '#073b40',
    text: '#e9d8a6',
    textSecondary: '#a8a090',
    border: '#053f40',
    divider: '#053f40',
  },

  branding: {
    logoContentId: null,
    faviconContentId: null,
    presetId: 'default',
  },
};
