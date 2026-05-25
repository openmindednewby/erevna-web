/**
 * Form-state + submit logic for the reset-password screen.
 *
 * Pulled out of the route component so the route stays under 200 lines and the
 * (testable) logic isn't entangled with router/navigation calls. The hook
 * returns plain values + callbacks; the caller wires them to JSX.
 *
 * Behaviour:
 * - Validates new password against the shared `passwordPolicy` (mirrors backend).
 * - Validates confirmPassword matches.
 * - Surfaces a single localised error message at submit time (preferring policy
 *   errors over mismatch errors so the user fixes one issue at a time).
 * - Calls `useBffResetPassword` (the BFF `/bff/reset-password` flow). On
 *   success, invokes `onSuccess` (the screen navigates to login + shows a
 *   toast).
 */
import { useMemo, useState } from 'react';

import { useBffResetPassword } from './bffPasswordHooks';
import { isPasswordValid } from './passwordPolicy';
import { ResetPasswordError } from './resetPasswordError';
import { isValueDefined } from '../utils/is';

const HTTP_BAD_REQUEST = 400;

export { ResetPasswordError };

interface UseResetPasswordFormArgs {
  token: string;
  onSuccess: () => void;
}

interface UseResetPasswordFormResult {
  newPassword: string;
  confirmPassword: string;
  setNewPassword: (value: string) => void;
  setConfirmPassword: (value: string) => void;
  isSubmitting: boolean;
  errorKey: ResetPasswordError | null;
  hasInvalidToken: boolean;
  submit: () => void;
}

function isHttpStatusError(message: string, status: number): boolean {
  return message.includes(` status ${String(status)}`);
}

function preflight(args: { newPassword: string; confirm: string; token: string }): ResetPasswordError | null {
  if (args.newPassword.length === 0 || args.confirm.length === 0) return ResetPasswordError.Empty;
  if (!isPasswordValid(args.newPassword)) return ResetPasswordError.WeakPassword;
  if (args.newPassword !== args.confirm) return ResetPasswordError.Mismatch;
  if (args.token === '') return ResetPasswordError.TokenInvalid;
  return null;
}

interface MutationCallbacks {
  onSuccess: () => void;
  setErrorKey: (e: ResetPasswordError) => void;
  setHasInvalidToken: (v: boolean) => void;
}

function useResetMutation(callbacks: MutationCallbacks): ReturnType<typeof useBffResetPassword> {
  const mutationOptions = useMemo(
    () => ({
      onSuccess: callbacks.onSuccess,
      onError: (err: Error): void => {
        if (isHttpStatusError(err.message, HTTP_BAD_REQUEST)) {
          callbacks.setHasInvalidToken(true);
          callbacks.setErrorKey(ResetPasswordError.TokenInvalid);
          return;
        }
        callbacks.setErrorKey(ResetPasswordError.Network);
      },
    }),
    [callbacks],
  );
  return useBffResetPassword(mutationOptions);
}

interface SubmitArgs {
  newPassword: string;
  confirmPassword: string;
  token: string;
  setErrorKey: (e: ResetPasswordError | null) => void;
  setHasInvalidToken: (v: boolean) => void;
  mutate: (req: { token: string; newPassword: string }) => void;
}

function runSubmit(args: SubmitArgs): void {
  args.setErrorKey(null);
  const failure = preflight({
    newPassword: args.newPassword,
    confirm: args.confirmPassword,
    token: args.token,
  });
  if (!isValueDefined(failure)) {
    args.mutate({ token: args.token, newPassword: args.newPassword });
    return;
  }
  if (failure === ResetPasswordError.TokenInvalid) args.setHasInvalidToken(true);
  args.setErrorKey(failure);
}

interface FormState {
  newPassword: string;
  confirmPassword: string;
  errorKey: ResetPasswordError | null;
  hasInvalidToken: boolean;
}

interface FormSetters {
  setNewPassword: (v: string) => void;
  setConfirmPassword: (v: string) => void;
  setErrorKey: (e: ResetPasswordError | null) => void;
  setHasInvalidToken: (v: boolean) => void;
}

function useFormState(): { state: FormState; setters: FormSetters } {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorKey, setErrorKey] = useState<ResetPasswordError | null>(null);
  const [hasInvalidToken, setHasInvalidToken] = useState(false);
  return {
    state: { newPassword, confirmPassword, errorKey, hasInvalidToken },
    setters: { setNewPassword, setConfirmPassword, setErrorKey, setHasInvalidToken },
  };
}

export function useResetPasswordForm({ token, onSuccess }: UseResetPasswordFormArgs): UseResetPasswordFormResult {
  const { state, setters } = useFormState();
  const callbacks = useMemo<MutationCallbacks>(
    () => ({ onSuccess, setErrorKey: setters.setErrorKey, setHasInvalidToken: setters.setHasInvalidToken }),
    [onSuccess, setters.setErrorKey, setters.setHasInvalidToken],
  );
  const mutation = useResetMutation(callbacks);
  const submit = (): void => runSubmit({
    newPassword: state.newPassword, confirmPassword: state.confirmPassword, token,
    setErrorKey: setters.setErrorKey, setHasInvalidToken: setters.setHasInvalidToken,
    mutate: mutation.mutate,
  });
  return {
    newPassword: state.newPassword, confirmPassword: state.confirmPassword,
    setNewPassword: setters.setNewPassword, setConfirmPassword: setters.setConfirmPassword,
    isSubmitting: mutation.status === 'pending',
    errorKey: state.errorKey, hasInvalidToken: state.hasInvalidToken, submit,
  };
}
