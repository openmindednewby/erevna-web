import { useMutation, type UseMutationOptions, type UseMutationResult } from '@tanstack/react-query';

import { bffAuthClient } from './bffAuthClient';

import type { BffResetPasswordRequest } from '@dloizides/auth-client';

type UseBffResetPasswordOptions = Omit<
  UseMutationOptions<undefined, Error, BffResetPasswordRequest>,
  'mutationFn'
>;

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
