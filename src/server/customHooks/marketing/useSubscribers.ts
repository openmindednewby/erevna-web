/**
 * Hooks for marketing subscribers: list, create, delete.
 * Wraps the hand-written marketing client over the notification API.
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { SUBSCRIBERS_QUERY_KEY } from './queryKeys';
import {
  createSubscriber,
  deleteSubscriber,
  listSubscribers,
} from '../../../lib/notifications/marketing/client';


import type {
  CreateSubscriberRequest,
  CreateSubscriberResponse,
  SubscriberDto,
} from '../../../lib/notifications/marketing/types';
import type { UseMutationResult, UseQueryResult } from '@tanstack/react-query';

/** Lists subscribers, returning the flattened array. */
export function useSubscribers(): UseQueryResult<SubscriberDto[]> {
  return useQuery({
    queryKey: [SUBSCRIBERS_QUERY_KEY],
    queryFn: async ({ signal }) => {
      const response = await listSubscribers(signal);
      return response.subscribers;
    },
  });
}

interface MutationCallbacks {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

/** Creates a subscriber and invalidates the subscribers list on success. */
export function useCreateSubscriber(
  callbacks?: MutationCallbacks,
): UseMutationResult<CreateSubscriberResponse, unknown, CreateSubscriberRequest> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['createSubscriber'],
    mutationFn: async (variables: CreateSubscriberRequest) => createSubscriber(variables),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [SUBSCRIBERS_QUERY_KEY] });
      callbacks?.onSuccess?.();
    },
    onError: callbacks?.onError,
  });
}

/** Deletes a subscriber by id and invalidates the subscribers list on success. */
export function useDeleteSubscriber(
  callbacks?: MutationCallbacks,
): UseMutationResult<void, unknown, string> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['deleteSubscriber'],
    mutationFn: async (id: string) => deleteSubscriber(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [SUBSCRIBERS_QUERY_KEY] });
      callbacks?.onSuccess?.();
    },
    onError: callbacks?.onError,
  });
}
