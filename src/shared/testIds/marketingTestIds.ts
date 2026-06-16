/** Test IDs for the marketing campaigns screen (subscribers + campaigns). */
export const MarketingTestIds = {
  // Screen
  MARKETING_SCREEN: 'marketing-screen',
  MARKETING_LOADING: 'marketing-loading',
  MARKETING_ERROR: 'marketing-error',

  // Subscribers
  MARKETING_SUBSCRIBERS_LIST: 'marketing-subscribers-list',
  MARKETING_SUBSCRIBERS_EMPTY: 'marketing-subscribers-empty',
  MARKETING_SUBSCRIBER_ROW: 'marketing-subscriber-row',
  MARKETING_SUBSCRIBER_REMOVE_BUTTON: 'marketing-subscriber-remove-button',
  MARKETING_SUBSCRIBER_EMAIL_INPUT: 'marketing-subscriber-email-input',
  MARKETING_SUBSCRIBER_NAME_INPUT: 'marketing-subscriber-name-input',
  MARKETING_SUBSCRIBER_ADD_BUTTON: 'marketing-subscriber-add-button',

  // Campaigns
  MARKETING_CAMPAIGNS_LIST: 'marketing-campaigns-list',
  MARKETING_CAMPAIGNS_EMPTY: 'marketing-campaigns-empty',
  MARKETING_CAMPAIGN_ROW: 'marketing-campaign-row',
  MARKETING_CAMPAIGN_SEND_BUTTON: 'marketing-campaign-send-button',
  MARKETING_CAMPAIGN_SEND_CONFIRM_BUTTON: 'marketing-campaign-send-confirm-button',
  MARKETING_CAMPAIGN_SEND_CANCEL_BUTTON: 'marketing-campaign-send-cancel-button',

  // New campaign form
  MARKETING_CAMPAIGN_NAME_INPUT: 'marketing-campaign-name-input',
  MARKETING_CAMPAIGN_SUBJECT_INPUT: 'marketing-campaign-subject-input',
  MARKETING_CAMPAIGN_BODY_INPUT: 'marketing-campaign-body-input',
  MARKETING_CAMPAIGN_CREATE_BUTTON: 'marketing-campaign-create-button',
} as const;
