import React from 'react';

import { BrandHomeLink, Topbar as SharedTopbar } from '@dloizides/ui-nav';
import { useDispatch, useSelector } from 'react-redux';


import { FM } from '@/localization/helpers';

import { useAuth } from '../../auth/AuthProvider';
import { TestIds } from '../../shared/testIds';
import { setLocale } from '../../store/slices/uiSlice';
import { TenantLogo } from '../core/TenantLogo';
import SafeNotificationBell from '../Notifications/SafeNotificationBell';

import type { RootState } from '../../store/reduxStore';

const FALLBACK_NAME = '---';
const SIGNED_IN_HOME_ROUTE = '/(protected)';

interface Props {
  onNavigate: (route: string) => void;
  showAccountButton?: boolean;
}

const Topbar = ({ onNavigate, showAccountButton = false }: Props): React.ReactElement => {
  const { user, userInfo, logout } = useAuth();
  const dispatch = useDispatch();
  const locale = useSelector((s: RootState) => s.ui.locale);

  function handleLogoutPress(): void {
    logout().catch(() => {});
  }

  const topbarUser = {
    name: user?.displayName ?? userInfo?.preferred_username ?? FALLBACK_NAME,
    email: user?.email ?? userInfo?.email ?? '',
  };

  const account = showAccountButton
    ? {
        label: FM('topbar.account'),
        hint: FM('topbar.accountHint'),
        onPress: () => {},
      }
    : undefined;

  return (
    <SharedTopbar
      account={account}
      language={{
        label: FM(`topbar.lang.${locale}`),
        hint: FM('topbar.langHint'),
        onPress: () => dispatch(setLocale(locale)),
      }}
      left={<BrandHomeLink label={FM('topbar.homeLabel')} route={SIGNED_IN_HOME_ROUTE} onNavigate={onNavigate}><TenantLogo /></BrandHomeLink>}
      logout={{
        label: FM('topbar.logout'),
        hint: FM('topbar.logoutHint'),
        onPress: handleLogoutPress,
        testID: TestIds.LOGOUT_BUTTON,
      }}
      notificationSlot={<SafeNotificationBell />}
      user={topbarUser}
    />
  );
};

export default Topbar;
