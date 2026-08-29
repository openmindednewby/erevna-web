/**
 * Guard-rail: the protected surface's auth `loading` must stay BOOT-ONLY.
 *
 * `app/(protected)/_layout.tsx` REPLACES the navigator with a spinner while
 * `loading` is true (`if (loading) return <spinner/>`). That replace-style
 * shape is safe *only* because `loading` flips `true -> false` exactly once, at
 * boot, and never returns to true — so the navigator mounts once, after the
 * `/bff/me` bootstrap, with the deep-link URL still in the bar. If a future
 * change ever re-enters `loading = true` after boot (a re-probe, a re-validate,
 * a focus refresh — the kefi OnboardingGate bug), the guard would unmount the
 * navigator mid-session and React Navigation would re-derive its DEFAULT route,
 * silently dropping the deep link. See the memory note
 * `reference_route_guard_spinner_unmounts_navigator`.
 *
 * This test fails the moment `loading` stops being boot-only. It observes
 * `loading` from the hook, so it is agnostic to where the flag is stored (here:
 * the Redux `authSlice`, not `useState`), and it exercises the provider's
 * post-boot, protected-surface API — `logout` and `applyBffSession`, the paths
 * a re-toggle would most plausibly be wired into.
 *
 * NB: this lives in a SIBLING file, not in `AuthProvider.test.tsx`, because that
 * file already pins the logout ORDERING contract — the two guard different bugs
 * and must both survive.
 *
 * 🔴 TRAP — two flags, only one is the guard's:
 *  - `loading` is the guard's flag. It MUST be boot-only. Asserted here.
 *  - `refreshingUserInfo` re-toggles by design (a post-boot user-info refresh)
 *    and the guard does NOT key on it — so it is deliberately NOT asserted.
 *
 * 🔴 Also excluded on purpose: `loginWithPassword` / `register` DO frame
 * themselves with `setLoading(true/false)` (see `useAuthOperations`). That is
 * correct — they run on the (auth) surface, never while the protected guard is
 * mounted — so exercising them here would be a false failure. Only the
 * operations that run WHILE on the protected surface (`logout`,
 * `applyBffSession`) are exercised.
 */
import React from 'react';

import { Pressable, Text } from 'react-native';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { fireEvent, render, waitFor } from '@testing-library/react-native';

import { AuthProvider, useAuth } from './AuthProvider';
import { bffAuthClient } from './bffAuthClient';
import authReducer from '../store/slices/authSlice';

import type { BffUser } from './keycloakTypes';

jest.mock('./bffAuthClient', () => ({
  bffAuthClient: {
    getCurrentUser: jest.fn(),
    logout: jest.fn(),
    login: jest.fn(),
    register: jest.fn(),
  },
}));

// Navigation is a same-origin `window.location.replace` in prod — mock it so
// the logout path's `onRedirect` does not tear down the jsdom document.
jest.mock('../lib/navigation', () => ({
  redirectTo: jest.fn(),
  setRedirectHandler: jest.fn(),
}));

// The real `scheduleLogoutCleanup` queues five `setTimeout`s (up to 1s) — it
// never touches `loading`, so mocking it keeps the guard-rail hermetic and
// leak-free without weakening what we assert.
jest.mock('./authStorageCleanup', () => ({
  clearClientAuthState: jest.fn(),
  scheduleLogoutCleanup: jest.fn(),
}));

// Drive the shared logout sequencer's callbacks so the provider's `logout`
// wiring actually runs, without the package's real network sequence.
jest.mock('@dloizides/auth-web', () => ({
  performBffLogout: jest.fn(
    async (opts: {
      onClearSession: () => void;
      client: { logout: () => Promise<unknown> };
      onRedirect: () => void;
    }): Promise<void> => {
      opts.onClearSession();
      await opts.client.logout();
      opts.onRedirect();
    },
  ),
}));

const mockedGetCurrentUser = bffAuthClient.getCurrentUser as jest.Mock;
const mockedLogout = bffAuthClient.logout as jest.Mock;

const USER = { sub: 'u1', email: 'a@b.com', roles: ['user'] } as unknown as BffUser;

/** Every `loading` value the context has emitted, in render order. */
const loadingHistory: boolean[] = [];

/** Reads the auth context, records `loading`, and exposes its post-boot API. */
const Probe = (): React.ReactElement => {
  const { loading, isLoggedIn, logout, applyBffSession } = useAuth();
  loadingHistory.push(loading);
  return (
    <>
      <Text testID="loading">{String(loading)}</Text>
      <Text testID="authed">{String(isLoggedIn)}</Text>
      <Pressable
        testID="do-apply"
        accessibilityLabel="apply bff session"
        accessibilityHint="applies a post-boot bff session"
        onPress={(): void => {
          applyBffSession(USER);
        }}
      >
        <Text>apply</Text>
      </Pressable>
      <Pressable
        testID="do-logout"
        accessibilityLabel="logout"
        accessibilityHint="ends the session"
        onPress={(): void => {
          void logout();
        }}
      >
        <Text>logout</Text>
      </Pressable>
    </>
  );
};

/** A fresh store per render — the real auth reducer, `loading: true` at boot. */
function renderWithStore(): ReturnType<typeof render> {
  const store = configureStore({ reducer: { auth: authReducer } });
  return render(
    <Provider store={store}>
      <AuthProvider>
        <Probe />
      </AuthProvider>
    </Provider>,
  );
}

/** Assert `loading` never returned to `true` after it first settled to `false`. */
function assertBootOnly(): void {
  const firstFalse = loadingHistory.indexOf(false);
  expect(firstFalse).toBeGreaterThanOrEqual(0);
  expect(loadingHistory.slice(firstFalse).some(Boolean)).toBe(false);
}

describe('AuthProvider — loading is boot-only (deep-link guard-rail)', () => {
  beforeEach(() => {
    loadingHistory.length = 0;
    jest.clearAllMocks();
    mockedLogout.mockResolvedValue(undefined);
  });

  it('flips loading true -> false once and never re-enters true across applyBffSession + logout (authenticated boot)', async () => {
    mockedGetCurrentUser.mockResolvedValue(USER);

    const { getByTestId } = renderWithStore();

    await waitFor(() => expect(getByTestId('loading').props.children).toBe('false'));
    expect(getByTestId('authed').props.children).toBe('true');

    fireEvent.press(getByTestId('do-apply'));
    await waitFor(() => expect(getByTestId('authed').props.children).toBe('true'));
    expect(getByTestId('loading').props.children).toBe('false');

    fireEvent.press(getByTestId('do-logout'));
    await waitFor(() => expect(mockedLogout).toHaveBeenCalledTimes(1));
    expect(getByTestId('loading').props.children).toBe('false');

    assertBootOnly();
  });

  it('settles loading to false on an unauthenticated boot and stays there', async () => {
    mockedGetCurrentUser.mockResolvedValue(null);

    const { getByTestId } = renderWithStore();

    await waitFor(() => expect(getByTestId('loading').props.children).toBe('false'));
    expect(getByTestId('authed').props.children).toBe('false');

    assertBootOnly();
  });

  it('settles loading to false even when the /bff/me bootstrap rejects', async () => {
    mockedGetCurrentUser.mockRejectedValue(new Error('bff down'));

    const { getByTestId } = renderWithStore();

    await waitFor(() => expect(getByTestId('loading').props.children).toBe('false'));
    expect(getByTestId('authed').props.children).toBe('false');

    assertBootOnly();
  });
});
