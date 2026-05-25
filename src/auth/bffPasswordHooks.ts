/**
 * React Query mutation hooks for the BFF password-reset flow.
 *
 * Replaces the `@dloizides/auth-client/react` `useForgotPassword` /
 * `useResetPassword` hooks, which were bound to the direct-KC `AuthApiClient`.
 * These call the shared `BffAuthClient` instead: `POST /bff/forgot-password`
 * and `POST /bff/reset-password`, both same-origin and proxied by the BFF to
 * TenantService.
 *
 * The mutation result type is `undefined` (not `void`): the BFF endpoints
 * return no body, and `undefined` is a valid generic type argument where the
 * lint config rejects `void`.
 */
import { useMutation, type UseMutationOptions, type UseMutationResult } from '@tanstack/react-query';

import { bffAuthClient } from './bffAuthClient';
import { type ForgotPasswordRequestWithUrl } from './forgotPasswordRequest';

import type { BffResetPasswordRequest } from '@dloizides/auth-client';

export type UseBffForgotPasswordOptions = Omit<
  UseMutationOptions<undefined, Error, ForgotPasswordRequestWithUrl>,
  'mutationFn'
>;

/**
 * Mutation that POSTs to `/bff/forgot-password`. The backend returns 200
 * unconditionally (no email enumeration); the UI should show the same
 * "if that email exists, we sent a link" message regardless of `onSuccess`
 * vs `onError`.
 */
export function useBffForgotPassword(
  options?: UseBffForgotPasswordOptions,
): UseMutationResult<undefined, Error, ForgotPasswordRequestWithUrl> {
  return useMutation<undefined, Error, ForgotPasswordRequestWithUrl>({
    mutationFn: async (request) => {
      await bffAuthClient.forgotPassword(request);
      return undefined;
    },
    ...options,
  });
}

export type UseBffResetPasswordOptions = Omit<
  UseMutationOptions<undefined, Error, BffResetPasswordRequest>,
  'mutationFn'
>;

/**
 * Mutation that POSTs to `/bff/reset-password`. A `400` (invalid / expired
 * token) surfaces as a rejected mutation with the status in the message.
 */
export function useBffResetPassword(
  options?: UseBffResetPasswordOptions,
): UseMutationResult<undefined, Error, BffResetPasswordRequest> {
  return useMutation<undefined, Error, BffResetPasswordRequest>({
    mutationFn: async (request) => {
      await bffAuthClient.resetPassword(request);
      return undefined;
    },
    ...options,
  });
}
