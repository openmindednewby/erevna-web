import { SURVEY_EMBED_KIND } from './embedKind';
import { buildEmbedUrl } from './embedUrlBuilder';

describe('buildEmbedUrl', () => {
  const baseUrl = 'https://app.example.com';
  const menuId = 'menu-abc-123';

  it('builds URL with embed=1 param and no optional params', () => {
    const url = buildEmbedUrl(baseUrl, menuId, { themeOverride: null, accentColor: null });
    expect(url).toBe(`${baseUrl}/public/menu/embed/${menuId}?embed=1`);
  });

  it('includes theme param when themeOverride is set', () => {
    const url = buildEmbedUrl(baseUrl, menuId, { themeOverride: 'dark', accentColor: null });
    expect(url).toContain('theme=dark');
    expect(url).toContain('embed=1');
  });

  it('includes accentColor param when set', () => {
    const url = buildEmbedUrl(baseUrl, menuId, { themeOverride: null, accentColor: '#ff0000' });
    expect(url).toContain('accentColor=%23ff0000');
  });

  it('includes both theme and accentColor when both are set', () => {
    const url = buildEmbedUrl(baseUrl, menuId, { themeOverride: 'light', accentColor: '#00ff00' });
    expect(url).toContain('theme=light');
    expect(url).toContain('accentColor=%2300ff00');
  });

  it('skips accentColor when value is empty or whitespace', () => {
    const url = buildEmbedUrl(baseUrl, menuId, { themeOverride: null, accentColor: '   ' });
    expect(url).not.toContain('accentColor');
  });

  it('encodes menuId in the URL path', () => {
    const specialId = 'menu with spaces';
    const url = buildEmbedUrl(baseUrl, specialId, { themeOverride: null, accentColor: null });
    expect(url).toContain('menu%20with%20spaces');
  });

  it('defaults to the menu route segment', () => {
    const url = buildEmbedUrl(baseUrl, menuId, { themeOverride: null, accentColor: null });
    expect(url).toContain('/public/menu/embed/');
  });

  it('uses the survey route segment for the survey kind', () => {
    const url = buildEmbedUrl(baseUrl, 'survey-1', {
      themeOverride: null,
      accentColor: null,
      kind: SURVEY_EMBED_KIND,
    });
    expect(url).toBe(`${baseUrl}/public/survey/embed/survey-1?embed=1`);
  });
});
