/** Small status pill used for subscribers and campaigns. */
import React from 'react';

import { Text, View } from 'react-native';

import { FM } from '../../../localization/helpers';
import { useTheme } from '../../../theme/hooks/useTheme';
import { marketingStyles } from '../styles';

interface Props {
  labelKey: string;
  testID: string;
}

const StatusBadge = ({ labelKey, testID }: Props): React.ReactElement => {
  const { theme } = useTheme();
  const backgroundColor = theme.colors.border;
  const textColor = theme.colors.text;

  return (
    <View style={[marketingStyles.badge, { backgroundColor }]} testID={testID}>
      <Text style={[marketingStyles.badgeText, { color: textColor }]}>{FM(labelKey)}</Text>
    </View>
  );
};

export default StatusBadge;
