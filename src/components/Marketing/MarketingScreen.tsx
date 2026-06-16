/**
 * MarketingScreen — organizer view to manage email subscribers and campaigns.
 * Logic-light: data + mutations live in the marketing custom hooks.
 */
import React from 'react';

import { ActivityIndicator, ScrollView, Text, View } from 'react-native';

import { FM } from '../../localization/helpers';
import { useCampaigns } from '../../server/customHooks/marketing/useCampaigns';
import { useSubscribers } from '../../server/customHooks/marketing/useSubscribers';
import { TestIds } from '../../shared/testIds';
import { useTheme } from '../../theme/hooks/useTheme';
import Breadcrumb from '../Shared/Breadcrumb';
import Heading from '../Shared/Heading';
import CampaignsSection from './components/CampaignsSection';
import SubscribersSection from './components/SubscribersSection';
import { marketingStyles } from './styles';

const MarketingScreen = (): React.ReactElement => {
  const { theme } = useTheme();
  const { colors } = theme;
  const primary = theme.palette.primary['500'];
  const errorColor = theme.semantic.error['500'];

  const subscribersQuery = useSubscribers();
  const campaignsQuery = useCampaigns();

  const isLoading = subscribersQuery.isLoading || campaignsQuery.isLoading;
  const isError = subscribersQuery.isError || campaignsQuery.isError;

  if (isLoading)
    return (
      <View
        style={[marketingStyles.container, marketingStyles.loadingContainer, { backgroundColor: colors.background }]}
        testID={TestIds.MARKETING_LOADING}
      >
        <ActivityIndicator color={primary} size="large" />
      </View>
    );

  if (isError)
    return (
      <View style={[marketingStyles.container, { backgroundColor: colors.background }]} testID={TestIds.MARKETING_ERROR}>
        <Text style={[marketingStyles.description, { color: errorColor }]}>
          {FM('marketing.errors.loadFailed')}
        </Text>
      </View>
    );

  return (
    <View style={[marketingStyles.container, { backgroundColor: colors.background }]} testID={TestIds.MARKETING_SCREEN}>
      <ScrollView contentContainerStyle={marketingStyles.scrollContent}>
        <Breadcrumb />
        <Heading>{FM('marketing.title')}</Heading>
        <Text style={[marketingStyles.description, { color: colors.textSecondary }]}>
          {FM('marketing.description')}
        </Text>

        <SubscribersSection />
        <CampaignsSection />
      </ScrollView>
    </View>
  );
};

export default MarketingScreen;
