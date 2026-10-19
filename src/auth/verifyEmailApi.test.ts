
import { resendVerificationEmail, verifyEmailToken } from './verifyEmailApi';
import { VerifyEmailErrorCode } from './verifyEmailErrorCode';
import { apiClient } from '../lib/api/apiClient';

jest.mock('../lib/api/apiClient', () => ({ apiClient: { post: jest.fn() } }));

interface PostConfig {
  withCredentials?: boolean;
  headers?: Record<string, string>;
  validateStatus?: (status: number) => boolean;
}

type PostMock = jest.Mock<Promise<unknown>, [string, unknown, PostConfig?]>;

const postMock = apiClient.post as unknown as PostMock;

function installPostMock(mock: PostMock): void {
  postMock.mockImplementation(mock);
}

interface FakeResponse {
  status: number;
  data: unknown;
}

function fakeResponse(body: unknown, status = 200): FakeResponse {
  return { status, data: body };
}

describe('verifyEmailApi', () => {
  afterEach(() => {
    postMock.mockReset();
  });

  describe('verifyEmailToken', () => {
    it('POSTs to /bff/verify-email with the CSRF header and token body', async () => {
      const mock: PostMock = jest.fn().mockResolvedValue(fakeResponse({ success: true }));
      installPostMock(mock);

      await verifyEmailToken('abc123');

      expect(mock).toHaveBeenCalledTimes(1);
      const [url, body, config] = mock.mock.calls[0];
      expect(url).toBe('/bff/verify-email');
      expect(config?.withCredentials).toBe(true);
      expect(config?.headers?.['X-BFF-Csrf']).toBe('1');
      expect(config?.headers?.['Content-Type']).toBe('application/json');
      expect(config?.validateStatus?.(400)).toBe(true);
      expect(body).toEqual({ token: 'abc123' });
    });

    it('resolves to success on { success: true } body', async () => {
      installPostMock(jest.fn().mockResolvedValue(fakeResponse({ success: true })));
      await expect(verifyEmailToken('t')).resolves.toEqual({ success: true });
    });

    it('maps known errorCode values onto VerifyEmailErrorCode entries', async () => {
      const codes: ReadonlyArray<[string, VerifyEmailErrorCode]> = [
        ['TOKEN_INVALID', VerifyEmailErrorCode.TokenInvalid],
        ['TOKEN_EXPIRED', VerifyEmailErrorCode.TokenExpired],
        ['TOKEN_USED', VerifyEmailErrorCode.TokenUsed],
        ['KEYCLOAK_UPDATE_FAILED', VerifyEmailErrorCode.KeycloakUpdateFailed],
      ];
      for (const [wire, expected] of codes) {
        installPostMock(
          jest.fn().mockResolvedValue(fakeResponse({ success: false, errorCode: wire }, 400)),
        );
        await expect(verifyEmailToken('t')).resolves.toEqual({
          success: false,
          errorCode: expected,
        });
      }
    });

    it('collapses unknown errorCode strings to Generic', async () => {
      installPostMock(
        jest.fn().mockResolvedValue(fakeResponse({ success: false, errorCode: 'WHO_KNOWS' }, 400)),
      );
      await expect(verifyEmailToken('t')).resolves.toEqual({
        success: false,
        errorCode: VerifyEmailErrorCode.Generic,
      });
    });

    it('collapses a non-object JSON body to Generic', async () => {
      installPostMock(jest.fn().mockResolvedValue(fakeResponse(null)));
      await expect(verifyEmailToken('t')).resolves.toEqual({
        success: false,
        errorCode: VerifyEmailErrorCode.Generic,
      });
    });

    it('collapses a request rejection (network failure) to Generic without throwing', async () => {
      installPostMock(jest.fn().mockRejectedValue(new Error('offline')));
      await expect(verifyEmailToken('t')).resolves.toEqual({
        success: false,
        errorCode: VerifyEmailErrorCode.Generic,
      });
    });
  });

  describe('resendVerificationEmail', () => {
    it('POSTs to /bff/resend-verification with the email + a verifyUrlTemplate', async () => {
      const mock: PostMock = jest.fn().mockResolvedValue(fakeResponse({}));
      installPostMock(mock);

      await resendVerificationEmail('user@example.com');

      expect(mock).toHaveBeenCalledTimes(1);
      const [url, rawBody] = mock.mock.calls[0];
      expect(url).toBe('/bff/resend-verification');
      const body = rawBody as Record<string, string>;
      expect(body.email).toBe('user@example.com');
      expect(body.verifyUrlTemplate).toContain('/verify-email?token={token}');
    });

    it('resolves true on a 2xx response (anti-enum semantics)', async () => {
      installPostMock(jest.fn().mockResolvedValue(fakeResponse({})));
      await expect(resendVerificationEmail('a@b.c')).resolves.toBe(true);
    });

    it('resolves false on a non-2xx response without throwing', async () => {
      installPostMock(jest.fn().mockResolvedValue(fakeResponse('', 500)));
      await expect(resendVerificationEmail('a@b.c')).resolves.toBe(false);
    });

    it('resolves false on a network failure without throwing', async () => {
      installPostMock(jest.fn().mockRejectedValue(new Error('offline')));
      await expect(resendVerificationEmail('a@b.c')).resolves.toBe(false);
    });
  });
});
