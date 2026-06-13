/**
 * Tell the service worker to evict cached public-API responses (surveys / menus)
 * so an editor's own preview — and any open public tab it controls — refreshes
 * immediately after a save/activate, without waiting for the next navigation.
 *
 * Cross-visitor freshness is already guaranteed by the SW's network-first
 * strategy (task #186); this is the same-session immediacy nicety. The message
 * type must match `purgeMessageType` in `pwa-sw.config.js`.
 *
 * No-op off-web, when no SW is registered, or when no SW controls the page yet.
 */
const PURGE_MESSAGE_TYPE = 'PURGE_PUBLIC_CACHE';

export function purgePublicCache(externalId?: string): void {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;
  const controller = navigator.serviceWorker.controller;
  if (!controller) return;
  controller.postMessage({ type: PURGE_MESSAGE_TYPE, externalId });
}
