import React from 'react';

import { act, render } from '@testing-library/react-native';

import type { useResetPasswordForm as UseResetPasswordForm } from './useResetPasswordForm';

const mockUseResetPassword = jest.fn();

jest.mock('./bffPasswordHooks', () => ({
  useBffResetPassword: (opts: unknown) => mockUseResetPassword(opts),
}));

type FormResult = ReturnType<typeof UseResetPasswordForm>;

interface ProbeResult {
  result: FormResult;
}

describe('useResetPasswordForm', () => {
  beforeEach(() => {
    mockUseResetPassword.mockReset();
  });

  const renderHook = (token: string, onSuccess: () => void): ProbeResult => {
    mockUseResetPassword.mockReturnValue({ status: 'idle', mutate: jest.fn(), reset: jest.fn() });
    const captured: ProbeResult = { result: undefined as unknown as FormResult };

     
    const { useResetPasswordForm } = require('./useResetPasswordForm');
    const Probe = (): null => {
      captured.result = (useResetPasswordForm as typeof UseResetPasswordForm)({ token, onSuccess });
      return null;
    };
    render(<Probe />);
    return captured;
  };

  it('flags empty fields with the empty error', () => {
    const captured = renderHook('valid-token', jest.fn());
    act(() => {
      captured.result.submit();
    });
    expect(captured.result.errorKey).toBe('empty');
  });

  it('flags weak passwords with the weakPassword error', () => {
    const captured = renderHook('valid-token', jest.fn());
    act(() => {
      captured.result.setNewPassword('weak');
      captured.result.setConfirmPassword('weak');
    });
    act(() => {
      captured.result.submit();
    });
    expect(captured.result.errorKey).toBe('weakPassword');
  });

  it('flags mismatched passwords with the mismatch error', () => {
    const captured = renderHook('valid-token', jest.fn());
    act(() => {
      captured.result.setNewPassword('Str0ngPass!');
      captured.result.setConfirmPassword('Different1');
    });
    act(() => {
      captured.result.submit();
    });
    expect(captured.result.errorKey).toBe('mismatch');
  });

  it('flags an empty token with the tokenInvalid error', () => {
    const captured = renderHook('', jest.fn());
    act(() => {
      captured.result.setNewPassword('Str0ngPass!');
      captured.result.setConfirmPassword('Str0ngPass!');
    });
    act(() => {
      captured.result.submit();
    });
    expect(captured.result.errorKey).toBe('tokenInvalid');
    expect(captured.result.hasInvalidToken).toBe(true);
  });

  it('calls mutate with the validated payload when valid', () => {
    const mutate = jest.fn();
    mockUseResetPassword.mockReturnValue({ status: 'idle', mutate, reset: jest.fn() });
    const captured: ProbeResult = { result: undefined as unknown as FormResult };

     
    const { useResetPasswordForm } = require('./useResetPasswordForm');
    const Probe = (): null => {
      captured.result = (useResetPasswordForm as typeof UseResetPasswordForm)({ token: 'tok-123', onSuccess: jest.fn() });
      return null;
    };
    render(<Probe />);

    act(() => {
      captured.result.setNewPassword('Str0ngPass!');
      captured.result.setConfirmPassword('Str0ngPass!');
    });
    act(() => {
      captured.result.submit();
    });

    expect(mutate).toHaveBeenCalledWith({ token: 'tok-123', newPassword: 'Str0ngPass!' });
    expect(captured.result.errorKey).toBeNull();
  });

  it('maps backend 400 errors to tokenInvalid (expired/consumed token branch)', () => {
    let onError: ((err: Error) => void) | undefined;
    mockUseResetPassword.mockImplementation((opts: { onError?: (err: Error) => void }) => {
      onError = opts.onError;
      return { status: 'idle', mutate: jest.fn(), reset: jest.fn() };
    });
    const captured: ProbeResult = { result: undefined as unknown as FormResult };

     
    const { useResetPasswordForm } = require('./useResetPasswordForm');
    const Probe = (): null => {
      captured.result = (useResetPasswordForm as typeof UseResetPasswordForm)({ token: 'tok-bad', onSuccess: jest.fn() });
      return null;
    };
    render(<Probe />);

    act(() => {
      onError?.(new Error('reset-password failed with status 400'));
    });

    expect(captured.result.errorKey).toBe('tokenInvalid');
    expect(captured.result.hasInvalidToken).toBe(true);
  });

  it('maps non-400 errors to network', () => {
    let onError: ((err: Error) => void) | undefined;
    mockUseResetPassword.mockImplementation((opts: { onError?: (err: Error) => void }) => {
      onError = opts.onError;
      return { status: 'idle', mutate: jest.fn(), reset: jest.fn() };
    });
    const captured: ProbeResult = { result: undefined as unknown as FormResult };

     
    const { useResetPasswordForm } = require('./useResetPasswordForm');
    const Probe = (): null => {
      captured.result = (useResetPasswordForm as typeof UseResetPasswordForm)({ token: 'tok', onSuccess: jest.fn() });
      return null;
    };
    render(<Probe />);

    act(() => {
      onError?.(new Error('reset-password failed with status 500'));
    });

    expect(captured.result.errorKey).toBe('network');
    expect(captured.result.hasInvalidToken).toBe(false);
  });

  it('forwards onSuccess to the consumer', () => {
    const onSuccess = jest.fn();
    let optsOnSuccess: (() => void) | undefined;
    mockUseResetPassword.mockImplementation((opts: { onSuccess?: () => void }) => {
      optsOnSuccess = opts.onSuccess;
      return { status: 'idle', mutate: jest.fn(), reset: jest.fn() };
    });

     
    const { useResetPasswordForm } = require('./useResetPasswordForm');
    const Probe = (): null => {
      (useResetPasswordForm as typeof UseResetPasswordForm)({ token: 'tok', onSuccess });
      return null;
    };
    render(<Probe />);

    act(() => {
      optsOnSuccess?.();
    });

    expect(onSuccess).toHaveBeenCalled();
  });
});
