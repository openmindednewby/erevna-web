const MENU_API_CACHE_NAME = 'public-menu-api-v1';

const STATIC_ASSETS_CACHE_NAME = 'static-assets-v1';

function isCacheApiAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  return 'caches' in window;
}

export async function clearMenuCache(): Promise<boolean> {
  if (!isCacheApiAvailable()) return false;

  try {
    return await caches.delete(MENU_API_CACHE_NAME);
  } catch {
    return false;
  }
}

export async function clearAllCaches(): Promise<boolean> {
  if (!isCacheApiAvailable()) return false;

  try {
    const results = await Promise.all([
      caches.delete(MENU_API_CACHE_NAME),
      caches.delete(STATIC_ASSETS_CACHE_NAME),
    ]);
    return results.some(Boolean);
  } catch {
    return false;
  }
}

export function getManagedCacheNames(): string[] {
  return [MENU_API_CACHE_NAME, STATIC_ASSETS_CACHE_NAME];
}
