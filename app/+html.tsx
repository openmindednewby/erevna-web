import type { PropsWithChildren, ReactElement } from 'react';

import { ScrollViewStyleReset } from 'expo-router/html';

// SEO Configuration Constants — Erevna marketing brand (locked).
// Mirrors apps/erevna-web/brand/brand.config.json (W-01 Outfit + T-18 tagline).
const SEO_CONFIG = {
  title: 'Erevna — From wondering to knowing',
  description:
    'Build forms, surveys, and quizzes your audience actually wants to fill out — and turn what they say into decisions you can act on.',
  url: 'https://erevna.dloizides.com',
  image: '/icons/logo-512.png',
  locale: 'en_US',
  siteName: 'Erevna',
};

// Critical CSS for immediate visual rendering (LCP optimization)
// These styles render the initial loading state without waiting for JS.
// Body font keeps the existing system stack — only the marketing wordmark uses Outfit
// (loaded as a separate stylesheet below). This preserves Tag Heuer's in-app continuity.
const criticalCss = `
*,*::before,*::after{box-sizing:border-box}
body{margin:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;background:#fff;-webkit-font-smoothing:antialiased}
.loading-container{display:flex;justify-content:center;align-items:center;height:100vh;width:100%;background:#fff;position:fixed;top:0;left:0;z-index:9999}
.loading-spinner{width:40px;height:40px;border:3px solid #e0e0e0;border-top-color:#008d5c;border-radius:50%;animation:spin 1s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
#root{min-height:100vh;display:flex;flex-direction:column}
`;

// Service worker registration - deferred to avoid blocking main thread (TBT optimization)
const swRegistrationScript = `
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    var register = function() {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then(function(reg) { console.log('SW registered', reg.scope); })
        .catch(function(err) { console.warn('SW failed', err); });
    };
    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(register);
    } else {
      setTimeout(register, 0);
    }
  });
}
`;

// Manifest probe - deferred and simplified
const manifestDebugScript = `
if (typeof __DEV__ !== 'undefined' && __DEV__) {
  var probe = function() {
    fetch('/manifest.json', { cache: 'no-store' })
      .then(function(res) { if (!res.ok) console.warn('Manifest not reachable'); })
      .catch(function(e) { console.warn('Manifest probe error', e); });
  };
  if (typeof requestIdleCallback !== 'undefined') requestIdleCallback(probe);
}
`;

// Script to remove initial loader after React hydrates
const removeLoaderScript = `
document.addEventListener('DOMContentLoaded', function() {
  var loader = document.getElementById('initial-loader');
  if (loader) {
    requestAnimationFrame(function() {
      loader.style.opacity = '0';
      loader.style.transition = 'opacity 0.2s';
      setTimeout(function() { loader.style.display = 'none'; }, 200);
    });
  }
});
`;

const RootHtml = ({ children }: PropsWithChildren): ReactElement => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta content="IE=edge" httpEquiv="X-UA-Compatible" />
        <meta content="width=device-width, initial-scale=1, shrink-to-fit=no" name="viewport" />

        {/* Critical CSS - inlined for immediate render (LCP optimization) */}
        <style dangerouslySetInnerHTML={{ __html: criticalCss }} />

        {/* Resource hints for faster API connections (LCP optimization) */}
        <link href="https://identity.dloizides.com" rel="preconnect" />
        <link href="https://identity.dloizides.com" rel="dns-prefetch" />
        <link href="https://erevna-api.dloizides.com" rel="preconnect" />
        <link href="https://erevna-api.dloizides.com" rel="dns-prefetch" />

        {/* Marketing wordmark font (Outfit) — preconnect for fast first paint on landings */}
        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link crossOrigin="anonymous" href="https://fonts.gstatic.com" rel="preconnect" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;500;700&display=swap"
          rel="stylesheet"
        />

        {/* SEO: Page Title */}
        <title>{SEO_CONFIG.title}</title>

        {/* SEO: Meta Description */}
        <meta content={SEO_CONFIG.description} name="description" />

        {/* SEO: Robots directive */}
        <meta content="index, follow" name="robots" />

        {/* SEO: Canonical URL */}
        <link href={SEO_CONFIG.url} rel="canonical" />

        {/* Open Graph meta tags for social sharing */}
        <meta content={SEO_CONFIG.title} property="og:title" />
        <meta content={SEO_CONFIG.description} property="og:description" />
        <meta content="website" property="og:type" />
        <meta content={SEO_CONFIG.url} property="og:url" />
        <meta content={`${SEO_CONFIG.url}${SEO_CONFIG.image}`} property="og:image" />
        <meta content={SEO_CONFIG.siteName} property="og:site_name" />
        <meta content={SEO_CONFIG.locale} property="og:locale" />

        {/* Twitter Card meta tags */}
        <meta content="summary_large_image" name="twitter:card" />
        <meta content={SEO_CONFIG.title} name="twitter:title" />
        <meta content={SEO_CONFIG.description} name="twitter:description" />
        <meta content={`${SEO_CONFIG.url}${SEO_CONFIG.image}`} name="twitter:image" />

        {/* Link the PWA manifest */}
        <link href="/manifest.json" rel="manifest" />

        {/* iOS add-to-home support */}
        <link href="/icons/logo-192.jpg" rel="apple-touch-icon" />
        <meta content="yes" name="apple-mobile-web-app-capable" />
        <meta content="default" name="apple-mobile-web-app-status-bar-style" />
        <meta content={SEO_CONFIG.siteName} name="application-name" />
        <meta content={SEO_CONFIG.siteName} name="apple-mobile-web-app-title" />

        {/* Theme color for mobile browsers — keeps BaseClient default for in-app continuity */}
        <meta content="#008d5c" name="theme-color" />

        <ScrollViewStyleReset />

        {/* Service worker registration - deferred (TBT optimization) */}
        <script defer dangerouslySetInnerHTML={{ __html: swRegistrationScript }} />
        {/* Debug: probe manifest availability (dev only, deferred) */}
        <script defer dangerouslySetInnerHTML={{ __html: manifestDebugScript }} />
      </head>
      <body>
        {/* Loading placeholder for LCP - shows immediately while JS loads */}
        <div className="loading-container" id="initial-loader">
          <div className="loading-spinner" />
        </div>
        {children}
        {/* Remove initial loader once React hydrates */}
        <script dangerouslySetInnerHTML={{ __html: removeLoaderScript }} />
      </body>
    </html>
  );
};

export default RootHtml;
