import { purgePublicCache } from './purgePublicCache';

describe('purgePublicCache', () => {
  const original = (navigator as { serviceWorker?: unknown }).serviceWorker;

  function setController(controller: { postMessage: jest.Mock } | null): void {
    Object.defineProperty(navigator, 'serviceWorker', {
      value: { controller },
      configurable: true,
    });
  }

  afterEach(() => {
    Object.defineProperty(navigator, 'serviceWorker', { value: original, configurable: true });
  });

  it('posts a purge message with the externalId to the SW controller', () => {
    const postMessage = jest.fn();
    setController({ postMessage });

    purgePublicCache('survey-123');

    expect(postMessage).toHaveBeenCalledWith({ type: 'PURGE_PUBLIC_CACHE', externalId: 'survey-123' });
  });

  it('posts an undefined externalId (purge-all) when none is given', () => {
    const postMessage = jest.fn();
    setController({ postMessage });

    purgePublicCache();

    expect(postMessage).toHaveBeenCalledWith({ type: 'PURGE_PUBLIC_CACHE', externalId: undefined });
  });

  it('is a no-op when no SW controls the page', () => {
    setController(null);
    expect(() => purgePublicCache('x')).not.toThrow();
  });
});
