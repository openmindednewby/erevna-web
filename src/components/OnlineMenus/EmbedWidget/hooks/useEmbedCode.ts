import { useMemo } from 'react';

import { isValueDefined } from '../../../../utils/is';
import { EMBED_SANDBOX_ATTRS } from '../utils/embedCodeConstants';
import { MENU_EMBED_KIND, type EmbedKind } from '../utils/embedKind';
import { buildEmbedUrl } from '../utils/embedUrlBuilder';

export interface EmbedWidgetConfig {
  width: string;
  height: number;
  themeOverride: 'light' | 'dark' | null;
  accentColor: string | null;
}

interface EmbedCodeResult {
  iframeCode: string;
  jsCode: string;
  embedUrl: string;
}

function buildIframeCode(embedUrl: string, config: EmbedWidgetConfig, kind: EmbedKind): string {
  return [
    `<iframe`,
    `  src="${embedUrl}"`,
    `  width="${config.width}"`,
    `  height="${String(config.height)}"`,
    `  frameborder="0"`,
    `  scrolling="no"`,
    `  loading="lazy"`,
    `  title="Embedded ${kind.titleNoun}"`,
    `  sandbox="${EMBED_SANDBOX_ATTRS}"`,
    `></iframe>`,
  ].join('\n');
}

function buildJsCode(config: EmbedWidgetConfig, publicUrl: string, id: string, kind: EmbedKind): string {
  const dataAttrs = [
    kind.dataAttr,
    `${kind.idAttr}="${id}"`,
    `data-origin="${publicUrl}"`,
    `data-width="${config.width}"`,
    `data-height="${String(config.height)}"`,
  ];

  if (isValueDefined(config.themeOverride))
    dataAttrs.push(`data-theme="${config.themeOverride}"`);

  if (isValueDefined(config.accentColor) && config.accentColor.trim() !== '')
    dataAttrs.push(`data-accent-color="${config.accentColor}"`);

  return [
    `<div ${dataAttrs.join(' ')}></div>`,
    `<script src="${publicUrl}/${kind.widgetFile}"></script>`,
  ].join('\n');
}

/**
 * Generates iframe and JS widget embed code snippets from the given configuration.
 * Pure computation, no side effects. The embed kind selects the route/widget/data-attrs.
 */
export function generateEmbedCode(
  config: EmbedWidgetConfig,
  publicUrl: string,
  id: string,
  kind: EmbedKind = MENU_EMBED_KIND,
): EmbedCodeResult {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const embedUrl = buildEmbedUrl(publicUrl, id, {
    themeOverride: config.themeOverride,
    accentColor: config.accentColor,
    origin,
    kind,
  });

  return {
    iframeCode: buildIframeCode(embedUrl, config, kind),
    jsCode: buildJsCode(config, publicUrl, id, kind),
    embedUrl,
  };
}

/** React hook wrapper around generateEmbedCode with memoization. */
export function useEmbedCode(
  config: EmbedWidgetConfig,
  publicUrl: string,
  id: string,
  kind: EmbedKind = MENU_EMBED_KIND,
): EmbedCodeResult {
  return useMemo(
    () => generateEmbedCode(config, publicUrl, id, kind),
    [config, publicUrl, id, kind],
  );
}
