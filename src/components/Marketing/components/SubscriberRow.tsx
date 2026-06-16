/** Single subscriber row: email/name + status + remove button. */
import React, { useCallback, useMemo } from 'react';

import { Text, TouchableOpacity, View } from 'react-native';

import { notifyError, notifySuccess } from '../../../lib/notifications';
import { subscriberStatusLabelKey } from '../../../lib/notifications/marketing/subscriberFormat';
import { FM } from '../../../localization/helpers';
import { useDeleteSubscriber } from '../../../server/customHooks/marketing/useSubscribers';
import { TestIds } from '../../../shared/testIds';
import { useTheme } from '../../../theme/hooks/useTheme';
import { isNotEmptyString } from '../../../utils/is';
import { marketingStyles } from '../styles';
import StatusBadge from './StatusBadge';

import type { SubscriberDto } from '../../../lib/notifications/marketing/types';

const REMOVE_GLYPH = '✕';

interface Props {
  subscriber: SubscriberDto;
}

const SubscriberRow = ({ subscriber }: Props): React.ReactElement => {
  const { theme } = useTheme();
  const { colors } = theme;

  const callbacks = useMemo(() => ({
    onSuccess: () => notifySuccess(FM('marketing.subscribers.removeSuccess')),
    onError: () => notifyError(FM('marketing.subscribers.removeError')),
  }), []);
  const { mutate, isPending } = useDeleteSubscriber(callbacks);

  const handleRemove = useCallback((): void => {
    mutate(subscriber.id);
  }, [mutate, subscriber.id]);

  const hasName = isNotEmptyString(subscriber.name ?? '');

  return (
    <View
      style={[marketingStyles.card, marketingStyles.row, { borderColor: colors.border, backgroundColor: colors.surface }]}
      testID={TestIds.MARKETING_SUBSCRIBER_ROW}
    >
      <View style={marketingStyles.rowMain}>
        <Text style={[marketingStyles.primaryText, { color: colors.text }]}>{subscriber.email}</Text>
        {hasName ? (
          <Text style={[marketingStyles.secondaryText, { color: colors.textSecondary }]}>{subscriber.name}</Text>
        ) : null}
      </View>
      <StatusBadge labelKey={subscriberStatusLabelKey(subscriber.status)} testID={`${TestIds.MARKETING_SUBSCRIBER_ROW}-status`} />
      <TouchableOpacity
        accessibilityHint={FM('marketing.subscribers.removeHint')}
        accessibilityLabel={FM('marketing.subscribers.removeLabel')}
        accessibilityRole="button"
        accessibilityState={{ disabled: isPending, busy: isPending }}
        disabled={isPending}
        style={marketingStyles.removeButton}
        testID={TestIds.MARKETING_SUBSCRIBER_REMOVE_BUTTON}
        onPress={handleRemove}
      >
        <Text style={[marketingStyles.removeIcon, { color: colors.textSecondary }]}>{REMOVE_GLYPH}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SubscriberRow;
