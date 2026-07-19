/**
 * Re-export of the shared FormActions from @dloizides/ui-forms (added with ui-forms@1.9.0).
 * Theme is supplied app-wide via FeedbackUiAdapter (@dloizides/ui-feedback context).
 *
 * This replaces an app-local copy that was byte-identical to katalogos-web's. Two deliberate
 * differences in the shared component, both handled at the call sites:
 *
 *  - Labels and hints are PRE-LOCALIZED props. The local copy resolved them internally via
 *    `FM('common.save')` / `FM('common.cancel')` / `FM('common.saveHint')` /
 *    `FM('common.discardHint')`, which coupled a shared UI primitive to one app's translation
 *    keys. `saveLabel` is now required; every call site passes its own text.
 *  - It renders `Button` from `@dloizides/ui-buttons` rather than `../core/Button`. That is NOT
 *    a visual change here: `core/Button` is itself a thin adapter over the very same shared
 *    Button (it only maps the app-local `ButtonVariant`/`ButtonSize` enums and an icon slot).
 *
 * The `save-button` / `cancel-button` testIDs are the shared component's own defaults, so
 * existing Playwright selectors keep matching.
 */
export { FormActions } from '@dloizides/ui-forms';
