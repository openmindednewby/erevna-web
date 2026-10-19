import { VerifyEmailErrorCode } from './verifyEmailErrorCode';
import { buildVerifyUrlTemplate } from './verifyEmailRequest';
import { apiClient } from '../lib/api/apiClient';
import { isValueDefined } from '../utils/is';

import type { AxiosResponse } from 'axios';

type VerifyEmailResult =
  | { success: true }
  | { success: false; errorCode: VerifyEmailErrorCode };

const CSRF_HEADER_NAME = 'X-BFF-Csrf';
const CSRF_HEADER_VALUE = '1';
const JSON_CONTENT_TYPE = 'application/json';
const VERIFY_ENDPOINT = '/bff/verify-email';
const RESEND_ENDPOINT = '/bff/resend-verification';
const HTTP_SUCCESS_MIN = 200;
const HTTP_SUCCESS_MAX_EXCLUSIVE = 300;

const SERVER_ERROR_CODES: readonly string[] = [
  VerifyEmailErrorCode.TokenInvalid,
  VerifyEmailErrorCode.TokenExpired,
  VerifyEmailErrorCode.TokenUsed,
  VerifyEmailErrorCode.KeycloakUpdateFailed,
];

function isServerErrorCode(value: unknown): value is VerifyEmailErrorCode {
  if (typeof value !== 'string') return false;
  return SERVER_ERROR_CODES.includes(value);
}

function buildHeaders(): Record<string, string> {
  return { 'Content-Type': JSON_CONTENT_TYPE, [CSRF_HEADER_NAME]: CSRF_HEADER_VALUE };
}

function acceptEveryStatus(): boolean {
  return true;
}

function isSuccessStatus(status: number): boolean {
  return status >= HTTP_SUCCESS_MIN && status < HTTP_SUCCESS_MAX_EXCLUSIVE;
}

async function postToBff(url: string, body: Record<string, string>): Promise<AxiosResponse<unknown>> {
  return apiClient.post<unknown>(url, body, {
    withCredentials: true,
    headers: buildHeaders(),
    validateStatus: acceptEveryStatus,
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object') return false;
  return isValueDefined(value);
}

function decodeVerifyResponse(body: unknown): VerifyEmailResult {
  if (!isRecord(body)) return { success: false, errorCode: VerifyEmailErrorCode.Generic };
  if (body.success === true) return { success: true };
  const code = body.errorCode;
  if (isServerErrorCode(code)) return { success: false, errorCode: code };
  return { success: false, errorCode: VerifyEmailErrorCode.Generic };
}

export async function verifyEmailToken(token: string): Promise<VerifyEmailResult> {
  try {
    const res = await postToBff(VERIFY_ENDPOINT, { token });
    return decodeVerifyResponse(res.data);
  } catch {
    return { success: false, errorCode: VerifyEmailErrorCode.Generic };
  }
}

export async function resendVerificationEmail(email: string): Promise<boolean> {
  try {
    const res = await postToBff(RESEND_ENDPOINT, { email, verifyUrlTemplate: buildVerifyUrlTemplate() });
    return isSuccessStatus(res.status);
  } catch {
    return false;
  }
}
