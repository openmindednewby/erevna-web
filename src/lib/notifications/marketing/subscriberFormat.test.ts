/** Tests for pure subscriber formatting helpers. */
import { subscriberStatusLabelKey } from './subscriberFormat';

describe('subscriberStatusLabelKey', () => {
  it('maps Subscribed to its label key', () => {
    expect(subscriberStatusLabelKey('Subscribed')).toBe('marketing.subscribers.status.subscribed');
  });

  it('maps Unsubscribed to its label key', () => {
    expect(subscriberStatusLabelKey('Unsubscribed')).toBe('marketing.subscribers.status.unsubscribed');
  });

  it('falls back to subscribed for unknown status', () => {
    expect(subscriberStatusLabelKey('Bogus')).toBe('marketing.subscribers.status.subscribed');
  });
});
