import type { PostHog } from 'posthog-js';

export async function loadPostHog(): Promise<PostHog> {
  const { default: posthog } = await import('posthog-js');
  return posthog;
}
