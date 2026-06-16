/**
 * Pure formatting helpers for marketing campaigns. UI-agnostic logic only
 * (no rendering) so it can be unit-tested in isolation.
 */
import CampaignStatus from './CampaignStatus';
import { FM } from '../../../localization/helpers';


import type { CampaignDto } from './types';

const DRAFT_LABEL_KEY = 'marketing.campaigns.status.draft';

const STATUS_LABEL_KEYS: Record<string, string | undefined> = {
  [CampaignStatus.Draft]: DRAFT_LABEL_KEY,
  [CampaignStatus.Sending]: 'marketing.campaigns.status.sending',
  [CampaignStatus.Sent]: 'marketing.campaigns.status.sent',
  [CampaignStatus.Failed]: 'marketing.campaigns.status.failed',
};

/** Maps a campaign status string to its i18n label key. Unknown -> draft key. */
export function campaignStatusLabelKey(status: string): string {
  return STATUS_LABEL_KEYS[status] ?? DRAFT_LABEL_KEY;
}

/** True when a campaign can still be sent (Draft only). */
export function isCampaignSendable(status: string): boolean {
  return status === String(CampaignStatus.Draft);
}

/**
 * Localized "sent X/Y, Z failed" summary for a campaign that has been sent.
 * Returns empty string for campaigns that have never been sent (still Draft).
 */
export function formatCampaignResults(campaign: Pick<CampaignDto, 'status' | 'recipientCount' | 'sentCount' | 'failedCount'>): string {
  if (campaign.status === String(CampaignStatus.Draft)) return '';

  return FM(
    'marketing.campaigns.resultSummary',
    String(campaign.sentCount),
    String(campaign.recipientCount),
    String(campaign.failedCount),
  );
}
