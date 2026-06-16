/** Tests for subscriber hooks — response mapping and mutation callbacks. */
import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react-native';

import {
  useCreateSubscriber,
  useDeleteSubscriber,
  useSubscribers,
} from './useSubscribers';

const mockListSubscribers = jest.fn();
const mockCreateSubscriber = jest.fn();
const mockDeleteSubscriber = jest.fn();

jest.mock('../../../lib/notifications/marketing/client', () => ({
  listSubscribers: (...args: unknown[]) => mockListSubscribers(...args),
  createSubscriber: (...args: unknown[]) => mockCreateSubscriber(...args),
  deleteSubscriber: (...args: unknown[]) => mockDeleteSubscriber(...args),
}));

function createWrapper(): React.FC<{ children: React.ReactNode }> {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
  return Wrapper;
}

describe('useSubscribers', () => {
  beforeEach(() => {
    mockListSubscribers.mockReset();
    mockCreateSubscriber.mockReset();
    mockDeleteSubscriber.mockReset();
  });

  it('flattens the subscribers array from the response envelope', async () => {
    const subscribers = [{ id: '1', email: 'a@b.com', name: null, status: 'Subscribed', createdAt: 'now' }];
    mockListSubscribers.mockResolvedValue({ subscribers });

    const { result } = renderHook(() => useSubscribers(), { wrapper: createWrapper() });

    await waitFor(() => { expect(result.current.isSuccess).toBe(true); });
    expect(result.current.data).toEqual(subscribers);
  });

  it('useCreateSubscriber passes variables through and fires onSuccess', async () => {
    mockCreateSubscriber.mockResolvedValue({ id: '1', email: 'a@b.com', name: null, status: 'Subscribed' });
    const onSuccess = jest.fn();

    const { result } = renderHook(() => useCreateSubscriber({ onSuccess }), { wrapper: createWrapper() });
    act(() => { result.current.mutate({ email: 'a@b.com' }); });

    await waitFor(() => { expect(result.current.isSuccess).toBe(true); });
    expect(mockCreateSubscriber).toHaveBeenCalledWith({ email: 'a@b.com' });
    expect(onSuccess).toHaveBeenCalled();
  });

  it('useDeleteSubscriber passes the id and fires onError on failure', async () => {
    mockDeleteSubscriber.mockRejectedValue(new Error('boom'));
    const onError = jest.fn();

    const { result } = renderHook(() => useDeleteSubscriber({ onError }), { wrapper: createWrapper() });
    act(() => { result.current.mutate('sub-7'); });

    await waitFor(() => { expect(result.current.isError).toBe(true); });
    expect(mockDeleteSubscriber).toHaveBeenCalledWith('sub-7');
    expect(onError).toHaveBeenCalled();
  });
});
