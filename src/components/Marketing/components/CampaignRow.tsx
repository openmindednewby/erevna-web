/** Single campaign row: name, subject, status badge, results, and Send flow. */
import React, { useCallback, useMemo, useState } from 'react';

import { Text, View } from 'react-native';

import { notifyError, notifySuccess } from '../../../lib/notifications';
import {
  campaignStatusLabelKey,
  formatCampaignResults,
  isCampaignSendable,
} from '../../../lib/notifications/marketing/campaignFormat';
import { FM } from '../../../localization/helpers';
import { useSendCampaign } from '../../../server/customHooks/marketing/useCampaigns';
import { TestIds } from '../../../shared/testIds';
import { useTheme } from '../../../theme/hooks/useTheme';
import { isNotEmptyString } from '../../../utils/is';
import { Button } from '../../core/Button';
import ButtonSize from '../../core/Button/utils/ButtonSize';
import ButtonVariant from '../../core/Button/utils/ButtonVariant';
import { marketingStyles } from '../styles';
import StatusBadge from './StatusBadge';

import type { CampaignDto } from '../../../lib/notifications/marketing/types';

interface Props {
  campaign: CampaignDto;
}

const CampaignRow = ({ campaign }: Props): React.ReactElement => {
  const { theme } = useTheme();
  const { colors } = theme;
  const [confirming, setConfirming] = useState(false);

  const callbacks = useMemo(() => ({
    onSuccess: () => {
      setConfirming(false);
      notifySuccess(FM('marketing.campaigns.sendSuccess'));
    },
    onError: () => {
      setConfirming(false);
      notifyError(FM('marketing.campaigns.sendError'));
    },
  }), []);
  const { mutate, isPending } = useSendCampaign(callbacks);

  const handleAskConfirm = useCallback((): void => setConfirming(true), []);
  const handleCancel = useCallback((): void => setConfirming(false), []);
  const handleConfirm = useCallback((): void => { mutate(campaign.id); }, [mutate, campaign.id]);

  const resultSummary = formatCampaignResults(campaign);
  const showResults = isNotEmptyString(resultSummary);
  const canSend = isCampaignSendable(campaign.status);

  return (
    <View
      style={[marketingStyles.card, { borderColor: colors.border, backgroundColor: colors.surface }]}
      testID={TestIds.MARKETING_CAMPAIGN_ROW}
    >
      <View style={marketingStyles.row}>
        <View style={marketingStyles.rowMain}>
          <Text style={[marketingStyles.primaryText, { color: colors.text }]}>{campaign.name}</Text>
          <Text style={[marketingStyles.secondaryText, { color: colors.textSecondary }]}>
            {FM('marketing.campaigns.subjectLabel')}: {campaign.subject}
          </Text>
          {showResults ? (
            <Text style={[marketingStyles.metaText, { color: colors.textSecondary }]}>{resultSummary}</Text>
          ) : null}
        </View>
        <StatusBadge labelKey={campaignStatusLabelKey(campaign.status)} testID={`${TestIds.MARKETING_CAMPAIGN_ROW}-status`} />
      </View>

      {canSend && !confirming ? (
        <View style={marketingStyles.cardActions}>
          <Button
            accessibilityHint={FM('marketing.campaigns.sendButtonHint')}
            accessibilityLabel={FM('marketing.campaigns.sendButton')}
            label={FM('marketing.campaigns.sendButton')}
            size={ButtonSize.Small}
            testID={TestIds.MARKETING_CAMPAIGN_SEND_BUTTON}
            variant={ButtonVariant.Primary}
            onPress={handleAskConfirm}
          />
        </View>
      ) : null}

      {canSend && confirming ? (
        <View>
          <Text style={[marketingStyles.metaText, { color: colors.text }]}>
            {FM('marketing.campaigns.sendConfirmPrompt')}
          </Text>
          <View style={marketingStyles.confirmRow}>
            <Button
              accessibilityHint={FM('marketing.campaigns.sendConfirmHint')}
              accessibilityLabel={FM('marketing.campaigns.sendConfirmButton')}
              label={FM('marketing.campaigns.sendConfirmButton')}
              loading={isPending}
              size={ButtonSize.Small}
              testID={TestIds.MARKETING_CAMPAIGN_SEND_CONFIRM_BUTTON}
              variant={ButtonVariant.Primary}
              onPress={handleConfirm}
            />
            <Button
              accessibilityHint={FM('marketing.campaigns.sendCancelHint')}
              accessibilityLabel={FM('marketing.campaigns.sendCancelButton')}
              disabled={isPending}
              label={FM('marketing.campaigns.sendCancelButton')}
              size={ButtonSize.Small}
              testID={TestIds.MARKETING_CAMPAIGN_SEND_CANCEL_BUTTON}
              variant={ButtonVariant.Outline}
              onPress={handleCancel}
            />
          </View>
        </View>
      ) : null}
    </View>
  );
};

export default CampaignRow;
