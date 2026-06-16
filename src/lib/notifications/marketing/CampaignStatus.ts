/** Lifecycle status of a marketing campaign (string values mirror the API). */
const enum CampaignStatus {
  Draft = 'Draft',
  Sending = 'Sending',
  Sent = 'Sent',
  Failed = 'Failed',
}

export default CampaignStatus;
