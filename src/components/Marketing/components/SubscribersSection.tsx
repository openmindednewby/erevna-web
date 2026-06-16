/** Subscribers section: title, add form, and the subscriber list. */
import React from 'react';

import { Text, View } from 'react-native';

import { FM } from '../../../localization/helpers';
import { useSubscribers } from '../../../server/customHooks/marketing/useSubscribers';
import { TestIds } from '../../../shared/testIds';
import { useTheme } from '../../../theme/hooks/useTheme';
import { isNotEmptyArray } from '../../../utils/is';
import { marketingStyles } from '../styles';
import SubscriberForm from './SubscriberForm';
import SubscriberRow from './SubscriberRow';

import type { SubscriberDto } from '../../../lib/notifications/marketing/types';

const SubscribersSection = (): React.ReactElement => {
  const { theme } = useTheme();
  const { colors } = theme;
  const { data } = useSubscribers();

  const subscribers: SubscriberDto[] = data ?? [];

  return (
    <View testID={TestIds.MARKETING_SUBSCRIBERS_LIST}>
      <Text style={[marketingStyles.sectionTitle, { color: colors.text }]}>
        {FM('marketing.subscribers.title')}
      </Text>

      <SubscriberForm />

      {isNotEmptyArray(subscribers) ? (
        subscribers.map((subscriber) => <SubscriberRow key={subscriber.id} subscriber={subscriber} />)
      ) : (
        <Text
          style={[marketingStyles.description, { color: colors.textSecondary }]}
          testID={TestIds.MARKETING_SUBSCRIBERS_EMPTY}
        >
          {FM('marketing.subscribers.empty')}
        </Text>
      )}
    </View>
  );
};

export default SubscribersSection;
