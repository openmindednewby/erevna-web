/**
 * Every translation key the shared `@dloizides/ui-*` kit asks the HOST app to provide.
 *
 * ── Why this file exists ──────────────────────────────────────────────────────
 * `FeedbackUiAdapter` wires `<FeedbackUiProvider t={FM}>`, so every kit component
 * resolves its strings through THIS app's `en.json`. `FM()` has no fallback by design —
 * a missing key renders the literal key string to the user (e.g. an unset dropdown
 * showing `common.selectPlaceholder`). The kit's keys are invisible to a normal
 * "grep the app for FM(" audit because the call sites live in `node_modules`, so they
 * silently rot every time the kit adds a string.
 *
 * `kitTranslationKeys.test.ts` asserts every key below resolves in `en.json`, so a kit
 * upgrade that introduces a new string FAILS the test suite instead of shipping raw
 * key text to production.
 *
 * ── Provenance ────────────────────────────────────────────────────────────────
 * ui-tables (@1.12.0) and ui-layout (@1.11.0) publish their key maps as real exports, so
 * those are imported LIVE below rather than copied — they cannot drift, and a kit bump that
 * adds a key widens this contract automatically. ui-tables@1.12.0 brought
 * `analytics.statCardLabel` / `analytics.statHint` (previously inlined in StatCard.tsx and
 * therefore invisible to this guard); ui-layout@1.11.0 brought `LAYOUT_I18N` and removed
 * its last raw key literal. Hand-maintained lists are what rotted across this fleet, so
 * prefer a live binding over a copied list whenever a package exposes one.
 *
 * ui-feedback has no exported map yet, so its keys are still extracted by grepping the
 * published bundle. Re-run after any kit bump — note the pattern must NOT require a dot,
 * or single-segment keys are missed:
 *
 *   grep -oE "\bt\((['\"])[A-Za-z0-9_.]+\1" \
 *     node_modules/@dloizides/<pkg>/dist/index.js | sort -u
 *
 * Last audited 2026-07-18 against: ui-layout@1.11.0, ui-feedback@1.4.0, ui-forms@1.6.0,
 * ui-nav@1.9.0, ui-buttons@1.3.0, ui-primitives@1.0.1, ui-tables@1.12.0.
 *
 * ui-forms, ui-nav, ui-buttons and ui-primitives contain ZERO `t(...)` calls — every
 * label they render is passed in by the caller — so they contribute no keys here.
 */
import { LAYOUT_I18N } from '@dloizides/ui-layout';
import { FILTERS_I18N, TABLE_I18N } from '@dloizides/ui-tables';

/**
 * `@dloizides/ui-layout` — StatusBadge, ModalDropdown, ModalShell, Accordion,
 * UpgradePrompt. Bound live to the package's own `LAYOUT_I18N` (1.11.0+), so this half
 * of the contract widens itself on a kit bump instead of being hand-maintained.
 *
 * Two entries are worth knowing about when reading `en.json`:
 * - `LAYOUT_I18N.close` resolves to `quizTemplates.cancel` — the key leaked out of THIS
 *   app's quiz-template screens when `ModalShell` was extracted into the shared kit, which
 *   is why erevna already defines it. It stays until the kit renames it to `common.*`.
 * - `settings.billing.upgradePrompt.*` backs `UpgradePrompt`, which this app does not mount
 *   today. The copy is defined ahead of use so that importing the component is a one-line
 *   change rather than a one-line change plus a silent i18n regression.
 */
const UI_LAYOUT_KEYS: readonly string[] = Object.values(LAYOUT_I18N);

/**
 * `@dloizides/ui-feedback` — ErrorState, ConfirmDialog, LoadingFallback, PageSkeleton.
 *
 * `ConfirmDialog`'s `confirmLabel`/`cancelLabel` and `EmptyListState`'s `messageKey` are
 * caller-supplied, so they are the app's own keys and are deliberately absent here.
 */
const UI_FEEDBACK_KEYS: readonly string[] = [
  'common.retry',
  'common.retryHint',
  'common.confirm',
  'common.confirmHint',
  'common.cancel',
  'common.cancelHint',
  'loadingFallback.label',
  'loadingFallback.hint',
  'pageSkeleton.loadingLabel',
  'pageSkeleton.loadingHint',
];

/**
 * `@dloizides/ui-tables` — every key comes from the package's own exported maps, so this
 * list widens automatically on a kit bump (which is exactly how ui-tables@1.12.0's three
 * new accessible-name keys were caught).
 */
const UI_TABLES_KEYS: readonly string[] = [
  ...Object.values(TABLE_I18N),
  ...Object.values(FILTERS_I18N),
];

/** The full contract, de-duplicated (the packages share the `common.*` namespace). */
export const KIT_REQUIRED_TRANSLATION_KEYS: readonly string[] = [
  ...new Set([...UI_LAYOUT_KEYS, ...UI_FEEDBACK_KEYS, ...UI_TABLES_KEYS]),
];
