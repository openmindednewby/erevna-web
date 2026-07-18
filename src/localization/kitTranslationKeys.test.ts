/**
 * The guard for the shared kit's half of `en.json`.
 *
 * The kit's `t(...)` call sites live in `node_modules`, so nothing in this repo
 * references them and a missing key produces no type error, no lint error, and no
 * runtime throw — just the literal key string rendered at the user. This suite is
 * the only thing standing between a kit upgrade and raw `uiTables.filters.apply` text
 * on screen.
 */
import { FILTERS_I18N, TABLE_I18N } from '@dloizides/ui-tables';

import { KIT_REQUIRED_TRANSLATION_KEYS } from './kitTranslationKeys';
import en from './locales/en.json';

/** Walks a dotted i18n path, mirroring how i18next resolves a key against the bundle. */
const resolveKey = (key: string): unknown =>
  key.split('.').reduce<unknown>((node, segment) => {
    if (node === null || typeof node !== 'object') return undefined;
    return (node as Record<string, unknown>)[segment];
  }, en);

describe('kit-required translation keys', () => {
  it('lists a non-empty contract, so a broken import cannot vacuously pass', () => {
    expect(KIT_REQUIRED_TRANSLATION_KEYS.length).toBeGreaterThan(0);
  });

  it.each(KIT_REQUIRED_TRANSLATION_KEYS)('en.json defines "%s"', (key) => {
    const value = resolveKey(key);

    // A non-empty string is the only resolution that renders. An object means the key
    // points at a namespace (i18next would return the key itself), and undefined or ''
    // both surface the raw key to the user.
    expect(typeof value).toBe('string');
    expect(value).not.toBe('');
  });

  it('reports every missing key at once rather than failing on the first', () => {
    const missing = KIT_REQUIRED_TRANSLATION_KEYS.filter(
      (key) => typeof resolveKey(key) !== 'string'
    );

    expect(missing).toEqual([]);
  });
});

describe('kit translation interpolation syntax', () => {
  /**
   * This app resolves kit strings through `FM`, which forwards its positional arguments
   * as i18next NAMED options (`{ p1, p2, p3 }`). i18next therefore substitutes the
   * DOUBLE-BRACE spelling `{{p1}}`.
   *
   * The sibling `@dloizides/i18n` runtime used by other apps in the fleet interpolates
   * POSITIONALLY (`{0}` / `{1}`) instead. Pasting a key from one of those apps into this
   * one renders the literal placeholder characters to a real user, and nothing else in
   * the pipeline catches it. These tests turn that trap into an invariant.
   */
  const SINGLE_PARAM_KEYS = [
    TABLE_I18N.selectPageSelected,
    TABLE_I18N.selectAllMatching,
    TABLE_I18N.selectMatchingSelected,
    TABLE_I18N.pagerRowsTriggerLabel,
    TABLE_I18N.pagerRowsOptionLabel,
    TABLE_I18N.statHint,
  ];

  const TWO_PARAM_KEYS = [FILTERS_I18N.selectTriggerLabel, TABLE_I18N.statCardLabel];

  it.each(SINGLE_PARAM_KEYS)('"%s" interpolates {{p1}}', (key) => {
    expect(resolveKey(key)).toContain('{{p1}}');
  });

  it.each(TWO_PARAM_KEYS)('"%s" interpolates {{p1}} and {{p2}}', (key) => {
    const value = resolveKey(key);

    expect(value).toContain('{{p1}}');
    expect(value).toContain('{{p2}}');
  });

  it('uses no positional {0}/{1} placeholders anywhere in the kit contract', () => {
    // The @dloizides/i18n spelling. Any occurrence here would ship raw braces to a user.
    const positional = KIT_REQUIRED_TRANSLATION_KEYS.filter((key) => {
      const value = resolveKey(key);
      return typeof value === 'string' && /\{\d+\}/.test(value);
    });

    expect(positional).toEqual([]);
  });

  it('uses no single-brace {p1} placeholders, which i18next would not substitute', () => {
    const singleBrace = KIT_REQUIRED_TRANSLATION_KEYS.filter((key) => {
      const value = resolveKey(key);
      return typeof value === 'string' && /(^|[^{])\{p\d\}/.test(value);
    });

    expect(singleBrace).toEqual([]);
  });
});
