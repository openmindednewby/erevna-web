/**
 * PWA service-worker + manifest config for erevna-web (surveys/forms).
 *
 * Consumed by `@dloizides/pwa-sw`'s `pwa-sw-gen` CLI (see the `generate:sw`
 * script). The package owns the caching STRATEGY (network-first for the public
 * API, cache-first for static assets, network-only for admin/auth + versioned
 * cache cleanup + purge handler); this file owns erevna's CONFIG.
 *
 * `public/service-worker.js` and `public/manifest.json` are GENERATED from this
 * file — do not hand-edit them; edit this config and re-run `npm run generate:sw`.
 *
 * Network-first is the FIX (task #186): erevna previously shipped
 * stale-while-revalidate v1, which could serve day-old survey content.
 */
module.exports = {
  serviceWorker: {
    // Bump the `-v2` suffix on a deploy that must evict stale entries.
    apiCacheName: 'erevna-public-api-v2',
    staticCacheName: 'erevna-static-assets-v1',
    // Public, cacheable reads. `questionerTemplates` is the survey payload
    // (the stale-content class this fix targets); `menus` covers the legacy
    // online-menu reads still present in this app.
    publicApiPathMatchers: ['/public/questionerTemplates/', '/public/menus/'],
    purgeMessageType: 'PURGE_PUBLIC_CACHE',
    // OFF deliberately: this app registers a SECOND service worker,
    // `/sw-notifications.js`, with an explicit `scope: '/'`
    // (src/lib/notifications/utils/serviceWorkerRegistration.ts:55). Two workers
    // at the SAME scope hand control back and forth, and a reload on
    // `controllerchange` turns that silent hand-off into a reload loop. With this
    // off, a new build's worker still installs, activates and evicts stale caches
    // - only the auto-reload of an already-open tab is skipped, so the tab
    // converges on the next navigation.
    reloadOnControllerChange: false,
  },
  manifest: {
    name: 'Erevna',
    shortName: 'Erevna',
    description: 'Install Erevna to create, manage, and answer surveys even when offline.',
    themeColor: '#008d5c',
    backgroundColor: '#ffffff',
    categories: ['productivity', 'utilities'],
    startUrl: '/?source=pwa',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    lang: 'en-US',
    dir: 'ltr',
    id: '/',
    icons: [
      { src: '/icons/logo-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/logo-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    ],
    screenshots: [
      { src: '/pwa-screenshot-wide.png', sizes: '1280x720', type: 'image/png', form_factor: 'wide' },
      { src: '/pwa-screenshot-mobile.png', sizes: '720x1280', type: 'image/png', form_factor: 'narrow' },
    ],
  },
};
