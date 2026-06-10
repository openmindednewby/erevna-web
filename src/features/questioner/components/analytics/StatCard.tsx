import React from 'react';

import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/theme/hooks/useTheme';

const CARD_PADDING = 16;
const CARD_RADIUS = 10;
const CARD_BORDER_WIDTH = 1;
const VALUE_FONT_SIZE = 32;
const LABEL_FONT_SIZE = 13;
const LABEL_MARGIN_TOP = 4;
const CARD_MIN_WIDTH = 160;

const styles = StyleSheet.create({
  card: {
    padding: CARD_PADDING,
    borderRadius: CARD_RADIUS,
    borderWidth: CARD_BORDER_WIDTH,
    minWidth: CARD_MIN_WIDTH,
  },
  value: {
    fontSize: VALUE_FONT_SIZE,
    fontWeight: '700',
  },
  label: {
    fontSize: LABEL_FONT_SIZE,
    marginTop: LABEL_MARGIN_TOP,
  },
});

interface StatCardProps {
  label: string;
  value: string;
  accessibilityLabel: string;
  accessibilityHint: string;
  testID?: string;
}

const StatCard = ({
  label,
  value,
  accessibilityLabel,
  accessibilityHint,
  testID,
}: StatCardProps): React.ReactElement => {
  const { theme } = useTheme();
  const { colors } = theme;
  const primary = theme.palette.primary['500'];

  return (
    <View
      accessibilityHint={accessibilityHint}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="summary"
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
      testID={testID}
    >
      <Text style={[styles.value, { color: primary }]}>{value}</Text>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
    </View>
  );
};

export default StatCard;
