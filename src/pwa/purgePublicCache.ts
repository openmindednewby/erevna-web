const PURGE_MESSAGE_TYPE = 'PURGE_PUBLIC_CACHE';

export function purgePublicCache(externalId?: string): void {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;
  const controller = navigator.serviceWorker.controller;
  if (!controller) return;
  controller.postMessage({ type: PURGE_MESSAGE_TYPE, externalId });
}
