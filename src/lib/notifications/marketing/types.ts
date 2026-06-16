/** Types for the NotificationService marketing API (subscribers + campaigns). */

export interface SubscriberDto {
  id: string;
  email: string;
  name: string | null;
  status: string;
  createdAt: string;
}

export interface CreateSubscriberRequest {
  email: string;
  name?: string;
}

export interface CreateSubscriberResponse {
  id: string;
  email: string;
  name: string | null;
  status: string;
}

export interface SubscribersListResponse {
  subscribers: SubscriberDto[];
}

export interface CampaignDto {
  id: string;
  name: string;
  subject: string;
  status: string;
  recipientCount: number;
  sentCount: number;
  failedCount: number;
  sentAt: string | null;
  createdAt: string;
}

export interface CreateCampaignRequest {
  name: string;
  subject: string;
  htmlBody: string;
}

export interface CreateCampaignResponse {
  id: string;
  name: string;
  subject: string;
  status: string;
}

export interface CampaignsListResponse {
  campaigns: CampaignDto[];
}

/** Result returned by POST /marketing/campaigns/{id}/send. */
export interface SendCampaignResponse {
  id: string;
  status: string;
  recipientCount: number;
  sentCount: number;
  failedCount: number;
}
