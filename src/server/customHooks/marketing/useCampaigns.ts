/**
 * Hooks for marketing campaigns: list, create, send.
 * Wraps the hand-written marketing client over the notification API.
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { CAMPAIGNS_QUERY_KEY } from './queryKeys';
import {
  createCampaign,
  listCampaigns,
  sendCampaign,
} from '../../../lib/notifications/marketing/client';


import type {
  CampaignDto,
  CreateCampaignRequest,
  CreateCampaignResponse,
  SendCampaignResponse,
} from '../../../lib/notifications/marketing/types';
import type { UseMutationResult, UseQueryResult } from '@tanstack/react-query';

/** Lists campaigns, returning the flattened array. */
export function useCampaigns(): UseQueryResult<CampaignDto[]> {
  return useQuery({
    queryKey: [CAMPAIGNS_QUERY_KEY],
    queryFn: async ({ signal }) => {
      const response = await listCampaigns(signal);
      return response.campaigns;
    },
  });
}

interface MutationCallbacks {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

/** Creates a campaign and invalidates the campaigns list on success. */
export function useCreateCampaign(
  callbacks?: MutationCallbacks,
): UseMutationResult<CreateCampaignResponse, unknown, CreateCampaignRequest> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['createCampaign'],
    mutationFn: async (variables: CreateCampaignRequest) => createCampaign(variables),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [CAMPAIGNS_QUERY_KEY] });
      callbacks?.onSuccess?.();
    },
    onError: callbacks?.onError,
  });
}

interface SendCampaignCallbacks {
  onSuccess?: (result: SendCampaignResponse) => void;
  onError?: (error: unknown) => void;
}

/** Sends a campaign by id and invalidates the campaigns list on success. */
export function useSendCampaign(
  callbacks?: SendCampaignCallbacks,
): UseMutationResult<SendCampaignResponse, unknown, string> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['sendCampaign'],
    mutationFn: async (id: string) => sendCampaign(id),
    onSuccess: async (result) => {
      await queryClient.invalidateQueries({ queryKey: [CAMPAIGNS_QUERY_KEY] });
      callbacks?.onSuccess?.(result);
    },
    onError: callbacks?.onError,
  });
}
