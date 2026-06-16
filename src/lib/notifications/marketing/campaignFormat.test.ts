/** Tests for pure campaign formatting helpers. */
import {
  campaignStatusLabelKey,
  formatCampaignResults,
  isCampaignSendable,
} from './campaignFormat';

describe('campaignStatusLabelKey', () => {
  it('maps each known status to its label key', () => {
    expect(campaignStatusLabelKey('Draft')).toBe('marketing.campaigns.status.draft');
    expect(campaignStatusLabelKey('Sending')).toBe('marketing.campaigns.status.sending');
    expect(campaignStatusLabelKey('Sent')).toBe('marketing.campaigns.status.sent');
    expect(campaignStatusLabelKey('Failed')).toBe('marketing.campaigns.status.failed');
  });

  it('falls back to the draft key for unknown status', () => {
    expect(campaignStatusLabelKey('Whatever')).toBe('marketing.campaigns.status.draft');
  });
});

describe('isCampaignSendable', () => {
  it('is true only for Draft', () => {
    expect(isCampaignSendable('Draft')).toBe(true);
    expect(isCampaignSendable('Sending')).toBe(false);
    expect(isCampaignSendable('Sent')).toBe(false);
    expect(isCampaignSendable('Failed')).toBe(false);
  });
});

describe('formatCampaignResults', () => {
  it('returns empty string for a Draft campaign', () => {
    expect(
      formatCampaignResults({ status: 'Draft', recipientCount: 10, sentCount: 0, failedCount: 0 }),
    ).toBe('');
  });

  it('formats counts for a sent campaign', () => {
    expect(
      formatCampaignResults({ status: 'Sent', recipientCount: 10, sentCount: 8, failedCount: 2 }),
    ).toBe('sent 8/10, 2 failed');
  });

  it('formats counts for a failed campaign', () => {
    expect(
      formatCampaignResults({ status: 'Failed', recipientCount: 5, sentCount: 0, failedCount: 5 }),
    ).toBe('sent 0/5, 5 failed');
  });
});
