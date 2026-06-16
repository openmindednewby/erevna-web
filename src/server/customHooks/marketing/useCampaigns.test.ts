/** Tests for campaign hooks — response mapping and send callback payload. */
import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react-native';

import {
  useCampaigns,
  useCreateCampaign,
  useSendCampaign,
} from './useCampaigns';

const mockListCampaigns = jest.fn();
const mockCreateCampaign = jest.fn();
const mockSendCampaign = jest.fn();

jest.mock('../../../lib/notifications/marketing/client', () => ({
  listCampaigns: (...args: unknown[]) => mockListCampaigns(...args),
  createCampaign: (...args: unknown[]) => mockCreateCampaign(...args),
  sendCampaign: (...args: unknown[]) => mockSendCampaign(...args),
}));

function createWrapper(): React.FC<{ children: React.ReactNode }> {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
  return Wrapper;
}

describe('useCampaigns', () => {
  beforeEach(() => {
    mockListCampaigns.mockReset();
    mockCreateCampaign.mockReset();
    mockSendCampaign.mockReset();
  });

  it('flattens the campaigns array from the response envelope', async () => {
    const campaigns = [{ id: 'c1', name: 'N', subject: 'S', status: 'Draft', recipientCount: 0, sentCount: 0, failedCount: 0, sentAt: null, createdAt: 'now' }];
    mockListCampaigns.mockResolvedValue({ campaigns });

    const { result } = renderHook(() => useCampaigns(), { wrapper: createWrapper() });

    await waitFor(() => { expect(result.current.isSuccess).toBe(true); });
    expect(result.current.data).toEqual(campaigns);
  });

  it('useCreateCampaign passes the body through', async () => {
    mockCreateCampaign.mockResolvedValue({ id: 'c1', name: 'N', subject: 'S', status: 'Draft' });
    const body = { name: 'N', subject: 'S', htmlBody: '<p>x</p>' };

    const { result } = renderHook(() => useCreateCampaign(), { wrapper: createWrapper() });
    act(() => { result.current.mutate(body); });

    await waitFor(() => { expect(result.current.isSuccess).toBe(true); });
    expect(mockCreateCampaign).toHaveBeenCalledWith(body);
  });

  it('useSendCampaign forwards the send result to onSuccess', async () => {
    const sendResult = { id: 'c1', status: 'Sent', recipientCount: 10, sentCount: 9, failedCount: 1 };
    mockSendCampaign.mockResolvedValue(sendResult);
    const onSuccess = jest.fn();

    const { result } = renderHook(() => useSendCampaign({ onSuccess }), { wrapper: createWrapper() });
    act(() => { result.current.mutate('c1'); });

    await waitFor(() => { expect(result.current.isSuccess).toBe(true); });
    expect(mockSendCampaign).toHaveBeenCalledWith('c1');
    expect(onSuccess).toHaveBeenCalledWith(sendResult);
  });
});
