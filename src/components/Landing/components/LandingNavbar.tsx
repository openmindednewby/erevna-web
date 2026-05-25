import React, { useState } from 'react';

import { StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';

import { useRouter } from 'expo-router';

import Wordmark from './Wordmark';
import { useAuth } from '../../../auth/AuthProvider';
import { FM } from '../../../localization/helpers';
import { TABLET_BREAKPOINT_PX } from '../../../shared/constants';
import { TestIds } from '../../../shared/testIds';
import { useTheme } from '../../../theme/hooks/useTheme';
import { BUTTON_BORDER_RADIUS, LANDING_MAX_WIDTH, LANDING_SECTION_PADDING_HORIZONTAL, NAVBAR_HEIGHT } from '../constants';

const NAV_LINK_FONT_SIZE = 15;
const BUTTON_FONT_SIZE = 14;
const BUTTON_PADDING_HORIZONTAL = 20;
const BUTTON_PADDING_VERTICAL = 10;
const MOBILE_MENU_PADDING = 16;
const HAMBURGER_LINE_HEIGHT = 2;
const HAMBURGER_LINE_WIDTH = 22;
const HAMBURGER_LINE_GAP = 5;
const HAMBURGER_TAP_SIZE = 40;
const MOBILE_LINK_FONT_SIZE = 16;
const DEFAULT_BORDER_WIDTH = 1;
const NAV_GAP = 32;
const NAVBAR_WORDMARK_SIZE = 22;
const HOME_ROUTE = '/';
const PRICING_ROUTE = '/pricing';
const LOGIN_ROUTE = '/(auth)/login';
const DASHBOARD_ROUTE = '/(protected)';

const styles = StyleSheet.create({
  outer: { width: '100%', alignItems: 'center' },
  outerBorder: { borderBottomWidth: DEFAULT_BORDER_WIDTH },
  inner: {
    width: '100%', maxWidth: LANDING_MAX_WIDTH, height: NAVBAR_HEIGHT,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: LANDING_SECTION_PADDING_HORIZONTAL,
  },
  navLinks: { flexDirection: 'row', gap: NAV_GAP },
  navLink: { fontSize: NAV_LINK_FONT_SIZE, fontWeight: '500' },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  loginBtn: {
    paddingHorizontal: BUTTON_PADDING_HORIZONTAL, paddingVertical: BUTTON_PADDING_VERTICAL,
    borderRadius: BUTTON_BORDER_RADIUS, borderWidth: DEFAULT_BORDER_WIDTH,
  },
  loginText: { fontSize: BUTTON_FONT_SIZE, fontWeight: '600' },
  registerBtn: {
    paddingHorizontal: BUTTON_PADDING_HORIZONTAL, paddingVertical: BUTTON_PADDING_VERTICAL,
    borderRadius: BUTTON_BORDER_RADIUS,
  },
  registerText: { fontSize: BUTTON_FONT_SIZE, fontWeight: '600' },
  hamburger: { width: HAMBURGER_TAP_SIZE, height: HAMBURGER_TAP_SIZE, justifyContent: 'center', alignItems: 'center' },
  hamburgerLine: { width: HAMBURGER_LINE_WIDTH, height: HAMBURGER_LINE_HEIGHT, borderRadius: 1, marginVertical: HAMBURGER_LINE_GAP / 2 },
  mobileMenu: { width: '100%', paddingHorizontal: MOBILE_MENU_PADDING, paddingVertical: MOBILE_MENU_PADDING, borderTopWidth: DEFAULT_BORDER_WIDTH },
  mobileLinkText: { fontSize: MOBILE_LINK_FONT_SIZE, fontWeight: '500', paddingVertical: 12 },
  mobileActions: { flexDirection: 'row', gap: 12, marginTop: 16 },
});

const LandingNavbar = (): React.ReactElement => {
  const { theme } = useTheme();
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isMobile = width <= TABLET_BREAKPOINT_PX;
  const isAuthenticated = isLoggedIn;
  const colors = theme.colors;
  const primaryColor = theme.palette.primary[500];
  const linkStyle = isMobile ? styles.mobileLinkText : styles.navLink;

  function handleNavigate(route: string): void {
    setMobileMenuOpen(false);
    router.push(route);
  }

  const navLinks = (
    <TouchableOpacity accessibilityHint={FM('landing.nav.pricingHint')} accessibilityLabel={FM('landing.nav.pricing')} accessibilityRole="link" testID={`${TestIds.LANDING_NAV_LINK}-pricing`} onPress={() => handleNavigate(PRICING_ROUTE)}>
      <Text style={[linkStyle, { color: colors.text }]}>{FM('landing.nav.pricing')}</Text>
    </TouchableOpacity>
  );

  const actionButtons = isAuthenticated ? (
    <TouchableOpacity accessibilityHint={FM('landing.nav.dashboardHint')} accessibilityLabel={FM('landing.nav.dashboard')} accessibilityRole="button" style={[styles.registerBtn, { backgroundColor: primaryColor }]} testID={TestIds.LANDING_NAV_DASHBOARD_BUTTON} onPress={() => handleNavigate(DASHBOARD_ROUTE)}>
      <Text style={[styles.registerText, { color: colors.surface }]}>{FM('landing.nav.dashboard')}</Text>
    </TouchableOpacity>
  ) : (
    <>
      <TouchableOpacity accessibilityHint={FM('landing.nav.loginHint')} accessibilityLabel={FM('landing.nav.login')} accessibilityRole="button" style={[styles.loginBtn, { borderColor: colors.border }]} testID={TestIds.LANDING_NAV_LOGIN_BUTTON} onPress={() => handleNavigate(LOGIN_ROUTE)}>
        <Text style={[styles.loginText, { color: colors.text }]}>{FM('landing.nav.login')}</Text>
      </TouchableOpacity>
      <TouchableOpacity accessibilityHint={FM('landing.nav.registerHint')} accessibilityLabel={FM('landing.nav.register')} accessibilityRole="button" style={[styles.registerBtn, { backgroundColor: primaryColor }]} testID={TestIds.LANDING_NAV_REGISTER_BUTTON} onPress={() => handleNavigate(LOGIN_ROUTE)}>
        <Text style={[styles.registerText, { color: colors.surface }]}>{FM('landing.nav.register')}</Text>
      </TouchableOpacity>
    </>
  );

  return (
    <View style={[styles.outer, styles.outerBorder, { backgroundColor: colors.surface, borderBottomColor: colors.border }]} testID={TestIds.LANDING_NAVBAR}>
      <View style={styles.inner}>
        <TouchableOpacity accessibilityHint={FM('landing.nav.homeHint')} accessibilityLabel={FM('landing.brand')} accessibilityRole="link" testID={TestIds.LANDING_NAV_BRAND} onPress={() => handleNavigate(HOME_ROUTE)}>
          <Wordmark color={primaryColor} size={NAVBAR_WORDMARK_SIZE} text={FM('landing.brand')} />
        </TouchableOpacity>
        {isMobile ? <TouchableOpacity accessibilityHint={FM('landing.nav.menuHint')} accessibilityLabel={FM('menu.title')} accessibilityRole="button" style={styles.hamburger} testID={TestIds.LANDING_NAV_MOBILE_MENU} onPress={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <View style={[styles.hamburgerLine, { backgroundColor: colors.text }]} />
            <View style={[styles.hamburgerLine, { backgroundColor: colors.text }]} />
            <View style={[styles.hamburgerLine, { backgroundColor: colors.text }]} />
          </TouchableOpacity> : null}
        {!isMobile && (
          <>
            <View style={styles.navLinks}>{navLinks}</View>
            <View style={styles.actions}>{actionButtons}</View>
          </>
        )}
      </View>
      {isMobile && mobileMenuOpen ? <View style={[styles.mobileMenu, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
          <View>{navLinks}</View>
          <View style={styles.mobileActions}>{actionButtons}</View>
        </View> : null}
    </View>
  );
};

export default LandingNavbar;
