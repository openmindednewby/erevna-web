/** Campaigns section: title, new-campaign form, and the campaign list. */
import React from 'react';

import { Text, View } from 'react-native';

import { FM } from '../../../localization/helpers';
import { useCampaigns } from '../../../server/customHooks/marketing/useCampaigns';
import { TestIds } from '../../../shared/testIds';
import { useTheme } from '../../../theme/hooks/useTheme';
import { isNotEmptyArray } from '../../../utils/is';
import { marketingStyles } from '../styles';
import CampaignForm from './CampaignForm';
import CampaignRow from './CampaignRow';

import type { CampaignDto } from '../../../lib/notifications/marketing/types';

const CampaignsSection = (): React.ReactElement => {
  const { theme } = useTheme();
  const { colors } = theme;
  const { data } = useCampaigns();

  const campaigns: CampaignDto[] = data ?? [];

  return (
    <View testID={TestIds.MARKETING_CAMPAIGNS_LIST}>
      <Text style={[marketingStyles.sectionTitle, { color: colors.text }]}>
        {FM('marketing.campaigns.title')}
      </Text>

      <CampaignForm />

      {isNotEmptyArray(campaigns) ? (
        campaigns.map((campaign) => <CampaignRow key={campaign.id} campaign={campaign} />)
      ) : (
        <Text
          style={[marketingStyles.description, { color: colors.textSecondary }]}
          testID={TestIds.MARKETING_CAMPAIGNS_EMPTY}
        >
          {FM('marketing.campaigns.empty')}
        </Text>
      )}
    </View>
  );
};

export default CampaignsSection;
