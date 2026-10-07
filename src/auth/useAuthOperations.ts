import { useCallback } from 'react';

import { useDispatch } from 'react-redux';

import { bffUserToKeycloakUserInfo, bffUserToNormalizedUser } from './bffUserMapping';
import { type BffUser } from './keycloakTypes';
import { setAuthenticated, setLoading, setUser, setUserInfo } from '../store/slices/authSlice';

import type { AppDispatch } from '../store/reduxStore';
import type { BffAuthClient, BffRegisterRequest } from '@dloizides/auth-client';

interface AuthOperations {
  loginWithPassword: (username: string, password: string) => Promise<void>;
  register: (request: BffRegisterRequest) => Promise<void>;
  applyBffSession: (user: BffUser) => void;
}

function persistBffSession(dispatch: AppDispatch, user: BffUser): void {
  dispatch(setUserInfo(bffUserToKeycloakUserInfo(user)));
  dispatch(setUser(bffUserToNormalizedUser(user)));
  dispatch(setAuthenticated(true));
}

async function runWithSessionFraming(
  dispatch: AppDispatch,
  call: () => Promise<BffUser>,
): Promise<void> {
  dispatch(setLoading(true));
  try {
    const user = await call();
    persistBffSession(dispatch, user);
  } finally {
    dispatch(setLoading(false));
  }
}

export function useAuthOperations(bffAuthClient: BffAuthClient): AuthOperations {
  const dispatch = useDispatch<AppDispatch>();

  const loginWithPassword = useCallback(
    async (username: string, password: string): Promise<void> =>
      runWithSessionFraming(dispatch, async () => bffAuthClient.login({ username, password })),
    [dispatch, bffAuthClient],
  );

  const register = useCallback(
    async (request: BffRegisterRequest): Promise<void> =>
      runWithSessionFraming(dispatch, async () => bffAuthClient.register(request)),
    [dispatch, bffAuthClient],
  );

  const applyBffSession = useCallback(
    (user: BffUser): void => {
      persistBffSession(dispatch, user);
    },
    [dispatch],
  );

  return { loginWithPassword, register, applyBffSession };
}
