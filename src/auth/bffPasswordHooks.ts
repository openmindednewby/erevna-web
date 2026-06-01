/**
 * React Query mutation hook for the BFF reset-password flow.
 *
 * Replaces the `@dloizides/auth-client/react` `useResetPassword` hook, which
 * was bound to the direct-KC `AuthApiClient`. This calls the shared
 * `BffAuthClient` instead: `POST /bff/reset-password`, same-origin and proxied
 * by the BFF to TenantService.
 *
 * The forgot-password half lives in `@dloizides/auth-web`'s react-query-free
 * `useForgotPasswordSubmit` / `<ForgotPasswordFields>` (the login route has no
 * QueryClientProvider, so a `useMutation`-based hook can never run there — the
 * old `useBffForgotPassword` was deleted as unused).
 *
 * The mutation result type is `undefined` (not `void`): the BFF endpoint
 * returns no body, and `undefined` is a valid generic type argument where the
 * lint config rejects `void`.
 */
import { useMutation, type UseMutationOptions, type UseMutationResult } from '@tanstack/react-query';

import { bffAuthClient } from './bffAuthClient';

import type { BffResetPasswordRequest } from '@dloizides/auth-client';

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
