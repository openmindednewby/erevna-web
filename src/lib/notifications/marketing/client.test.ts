/** Tests for the marketing API client — verifies URL/method/body mapping. */
import {
  createCampaign,
  createSubscriber,
  deleteSubscriber,
  listCampaigns,
  listSubscribers,
  sendCampaign,
} from './client';

const mockNotificationInstance = jest.fn();
jest.mock('../../../server/mutators/notificationMutator', () => ({
  notificationInstance: (...args: unknown[]) => mockNotificationInstance(...args),
}));

describe('marketing client', () => {
  beforeEach(() => {
    mockNotificationInstance.mockReset();
    mockNotificationInstance.mockResolvedValue({});
  });

  it('listSubscribers GETs the subscribers endpoint', async () => {
    await listSubscribers();
    expect(mockNotificationInstance).toHaveBeenCalledWith(
      expect.objectContaining({ url: '/api/v1/marketing/subscribers', method: 'GET' }),
    );
  });

  it('createSubscriber POSTs the body to the subscribers endpoint', async () => {
    const body = { email: 'a@b.com', name: 'Ada' };
    await createSubscriber(body);
    expect(mockNotificationInstance).toHaveBeenCalledWith(
      expect.objectContaining({ url: '/api/v1/marketing/subscribers', method: 'POST', data: body }),
    );
  });

  it('deleteSubscriber DELETEs the id-scoped endpoint', async () => {
    await deleteSubscriber('sub-1');
    expect(mockNotificationInstance).toHaveBeenCalledWith(
      expect.objectContaining({ url: '/api/v1/marketing/subscribers/sub-1', method: 'DELETE' }),
    );
  });

  it('listCampaigns GETs the campaigns endpoint', async () => {
    await listCampaigns();
    expect(mockNotificationInstance).toHaveBeenCalledWith(
      expect.objectContaining({ url: '/api/v1/marketing/campaigns', method: 'GET' }),
    );
  });

  it('createCampaign POSTs the body to the campaigns endpoint', async () => {
    const body = { name: 'Spring', subject: 'Hi', htmlBody: '<p>Hi</p>' };
    await createCampaign(body);
    expect(mockNotificationInstance).toHaveBeenCalledWith(
      expect.objectContaining({ url: '/api/v1/marketing/campaigns', method: 'POST', data: body }),
    );
  });

  it('sendCampaign POSTs to the id-scoped send endpoint', async () => {
    await sendCampaign('camp-9');
    expect(mockNotificationInstance).toHaveBeenCalledWith(
      expect.objectContaining({ url: '/api/v1/marketing/campaigns/camp-9/send', method: 'POST' }),
    );
  });
});
