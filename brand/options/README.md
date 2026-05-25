# Erevna Brand Options

This folder is the gallery of candidates for Erevna's marketing landing brand. Strategy 1 (inherit BaseClient defaults) is locked, so this brand applies ONLY to:

- The marketing landing (`erevna.dloizides.com` homepage)
- The browser tab title for non-app pages
- Marketing emails to non-tenant prospects (when/if those exist)

It does NOT change:

- The in-app theme (Tag Heuer's tenant theme overrides apply, BaseClient defaults fall through)
- Login screens (realm theme inherited from `OnlineMenu` realm)
- Transactional emails (per-realm config inherited)

## How to use

1. Open `wordmark-gallery.html` in your browser:
   ```
   file:///C:/desktopContents/projects/SaaS/apps/erevna-web/brand/options/wordmark-gallery.html
   ```
   Or just double-click it.
2. Browse the 12 wordmark candidates and 15 taglines.
3. Tell me your picks by ID:
   - Wordmark: e.g. `W-05` (IBM Plex Sans)
   - Tagline: e.g. `T-04` (Ask better. Learn faster.)
4. I'll generate the final SVG/PNG wordmark and wire it into the landing page.

## Greek script support

Cards marked with the **GREEK ✓** badge correctly render Έρευνα in the actual font. Other cards fall back to your system Greek font for that line — they're still valid choices if you only plan to use the Latin "Erevna" wordmark.

## Files in this folder

- `wordmark-gallery.html` — visual gallery of all options (open in browser)
- `README.md` — this file

Once you pick, the wordmark will be exported as:
- `wordmark.svg` — vector master
- `wordmark.png` — raster fallback at 32 / 64 / 128 / 256 / 512 px
- `wordmark-light.svg` (variant for dark backgrounds) — when needed
