/**
 * Marketing API client — hand-written thin wrapper over the shared notification
 * mutator (mirrors webPush.ts). Hits NotificationService's /api/v1/marketing/*
 * endpoints. The NotificationService swagger for these endpoints is not
 * regenerated this session, so these are hand-written rather than Orval-generated.
 */
import { notificationInstance } from '../../../server/mutators/notificationMutator';

import type {
  CampaignsListResponse,
  CreateCampaignRequest,
  CreateCampaignResponse,
  CreateSubscriberRequest,
  CreateSubscriberResponse,
  SendCampaignResponse,
  SubscribersListResponse,
} from './types';

const SUBSCRIBERS_ENDPOINT = '/api/v1/marketing/subscribers';
const CAMPAIGNS_ENDPOINT = '/api/v1/marketing/campaigns';

/** GET /marketing/subscribers */
export async function listSubscribers(signal?: AbortSignal): Promise<SubscribersListResponse> {
  return notificationInstance<SubscribersListResponse>({
    url: SUBSCRIBERS_ENDPOINT,
    method: 'GET',
    signal,
  });
}

/** POST /marketing/subscribers */
export async function createSubscriber(
  body: CreateSubscriberRequest,
): Promise<CreateSubscriberResponse> {
  return notificationInstance<CreateSubscriberResponse, CreateSubscriberRequest>({
    url: SUBSCRIBERS_ENDPOINT,
    method: 'POST',
    data: body,
  });
}

/** DELETE /marketing/subscribers/{id} */
export async function deleteSubscriber(id: string): Promise<void> {
  await notificationInstance({
    url: `${SUBSCRIBERS_ENDPOINT}/${id}`,
    method: 'DELETE',
  });
}

/** GET /marketing/campaigns */
export async function listCampaigns(signal?: AbortSignal): Promise<CampaignsListResponse> {
  return notificationInstance<CampaignsListResponse>({
    url: CAMPAIGNS_ENDPOINT,
    method: 'GET',
    signal,
  });
}

/** POST /marketing/campaigns */
export async function createCampaign(
  body: CreateCampaignRequest,
): Promise<CreateCampaignResponse> {
  return notificationInstance<CreateCampaignResponse, CreateCampaignRequest>({
    url: CAMPAIGNS_ENDPOINT,
    method: 'POST',
    data: body,
  });
}

/** POST /marketing/campaigns/{id}/send */
export async function sendCampaign(id: string): Promise<SendCampaignResponse> {
  return notificationInstance<SendCampaignResponse>({
    url: `${CAMPAIGNS_ENDPOINT}/${id}/send`,
    method: 'POST',
  });
}
