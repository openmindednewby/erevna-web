import { PRICING_CANONICAL_URL, QUESTIONNAIRES_CANONICAL_URL } from './canonicalUrls';

describe('canonicalUrls', () => {
  it('for the pricing route, is the pricing page url', () => {
    const expectedUrl = 'https://erevna.dloizides.com/pricing';

    const url = PRICING_CANONICAL_URL;

    expect(url).toBe(expectedUrl);
  });

  it('for the questionnaires route, is the questionnaires page url', () => {
    const expectedUrl = 'https://erevna.dloizides.com/questionnaires';

    const url = QUESTIONNAIRES_CANONICAL_URL;

    expect(url).toBe(expectedUrl);
  });
});
