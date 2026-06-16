/** Pure formatting helpers for marketing subscribers (no rendering). */

const SUBSCRIBED = 'Subscribed';
const UNSUBSCRIBED = 'Unsubscribed';

/** Maps a subscriber status string to its i18n label key. */
export function subscriberStatusLabelKey(status: string): string {
  if (status === UNSUBSCRIBED) return 'marketing.subscribers.status.unsubscribed';
  if (status === SUBSCRIBED) return 'marketing.subscribers.status.subscribed';
  return 'marketing.subscribers.status.subscribed';
}
