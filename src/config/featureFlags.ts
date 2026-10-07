import env from './environment';
import { isValueDefined } from '../utils/is';

function parseBoolean(value: string | boolean | undefined, defaultValue: boolean): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string')
    return value.toLowerCase() === 'true' || value === '1';

  return defaultValue;
}

function getFeatureFlag(
  envKey: string,
  configValue: boolean | undefined,
  defaultValue: boolean
): boolean {
  const processEnv: Record<string, string | undefined> = process.env;
  const envValue = processEnv[envKey];
  if (isValueDefined(envValue))
    return parseBoolean(envValue, defaultValue);

  if (isValueDefined(configValue))
    return configValue;

  return defaultValue;
}

export interface FeatureFlags {
  /** Identity module - users and tenants management (always enabled) */
  identityModule: boolean;
  /** Questioner module - quiz templates, answers, active quizzes */
  questionerModule: boolean;
  /** OnlineMenu module - menu and category management */
  onlineMenuModule: boolean;
  /** Tenant Theme Editor module - theme CRUD management */
  tenantThemeEditorModule: boolean;
  /** Theme editor section - customization UI (showcase/native-forms) */
  enableThemeEditor: boolean;
  /** PWA install prompt for Theme Studio */
  enableInstallPrompt: boolean;
  /** Analytics tracking (Umami + PostHog) */
  analyticsEnabled: boolean;
}

function getEnvBoolean(key: 'FEATURE_IDENTITY_MODULE' | 'FEATURE_QUESTIONER_MODULE' | 'FEATURE_ONLINEMENU_MODULE' | 'FEATURE_TENANT_THEME_EDITOR_MODULE' | 'FEATURE_ENABLE_THEME_EDITOR' | 'FEATURE_ENABLE_INSTALL_PROMPT' | 'FEATURE_ANALYTICS_ENABLED'): boolean | undefined {
  const value = env[key];
  if (typeof value === 'boolean') return value;
  return undefined;
}

export const featureFlags: FeatureFlags = {
  identityModule: getFeatureFlag(
    'EXPO_PUBLIC_FEATURE_IDENTITY_MODULE',
    getEnvBoolean('FEATURE_IDENTITY_MODULE'),
    true
  ),
  questionerModule: getFeatureFlag(
    'EXPO_PUBLIC_FEATURE_QUESTIONER_MODULE',
    getEnvBoolean('FEATURE_QUESTIONER_MODULE'),
    true
  ),
  onlineMenuModule: getFeatureFlag(
    'EXPO_PUBLIC_FEATURE_ONLINEMENU_MODULE',
    getEnvBoolean('FEATURE_ONLINEMENU_MODULE'),
    true
  ),
  tenantThemeEditorModule: getFeatureFlag(
    'EXPO_PUBLIC_FEATURE_TENANT_THEME_EDITOR_MODULE',
    getEnvBoolean('FEATURE_TENANT_THEME_EDITOR_MODULE'),
    true
  ),
  enableThemeEditor: getFeatureFlag(
    'EXPO_PUBLIC_ENABLE_THEME_EDITOR',
    getEnvBoolean('FEATURE_ENABLE_THEME_EDITOR'),
    true
  ),
  enableInstallPrompt: getFeatureFlag(
    'EXPO_PUBLIC_ENABLE_INSTALL_PROMPT',
    getEnvBoolean('FEATURE_ENABLE_INSTALL_PROMPT'),
    true
  ),
  analyticsEnabled: getFeatureFlag(
    'EXPO_PUBLIC_FEATURE_ANALYTICS_ENABLED',
    getEnvBoolean('FEATURE_ANALYTICS_ENABLED'),
    true
  ),
};

export function isModuleEnabled(module: keyof FeatureFlags): boolean {
  return featureFlags[module];
}

export const getServiceConfig = (): { identity: boolean; questioner: boolean; onlinemenu: boolean } => ({
  identity: featureFlags.identityModule,
  questioner: featureFlags.questionerModule,
  onlinemenu: featureFlags.onlineMenuModule,
});

export default featureFlags;
