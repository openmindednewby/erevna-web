import { MENU_EMBED_KIND, type EmbedKind } from './embedKind';
import { isValueDefined } from '../../../../utils/is';

interface EmbedUrlOptions {
  themeOverride: 'light' | 'dark' | null;
  accentColor: string | null;
  origin?: string | null;
  /** Embed kind (menu / survey). Defaults to menu for backward compatibility. */
  kind?: EmbedKind;
}

/**
 * Builds the full embed URL for a given external ID and configuration.
 * Pure function with no side effects. The embed kind selects the public route segment.
 */
export function buildEmbedUrl(
  publicUrl: string,
  externalId: string,
  options: EmbedUrlOptions,
): string {
  const kind = options.kind ?? MENU_EMBED_KIND;
  const base = `${publicUrl}/public/${kind.pathSegment}/embed/${encodeURIComponent(externalId)}`;
  const params: string[] = ['embed=1'];

  if (isValueDefined(options.themeOverride))
    params.push(`theme=${encodeURIComponent(options.themeOverride)}`);

  if (isValueDefined(options.accentColor) && options.accentColor.trim() !== '')
    params.push(`accentColor=${encodeURIComponent(options.accentColor)}`);

  if (isValueDefined(options.origin) && options.origin.trim() !== '')
    params.push(`origin=${encodeURIComponent(options.origin)}`);

  return `${base}?${params.join('&')}`;
}
