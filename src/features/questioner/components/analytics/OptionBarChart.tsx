import React from 'react';

import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import Svg, { Rect } from 'react-native-svg';

import { FM } from '@/localization/helpers';
import { TestIds } from '@/shared/testIds';
import { useTheme } from '@/theme/hooks/useTheme';

import type { OptionDistribution } from '../../utils/analyticsAggregator';

const TITLE_FONT_SIZE = 15;
const TITLE_MARGIN_BOTTOM = 10;
const ROW_MARGIN_BOTTOM = 10;
const LABEL_FONT_SIZE = 13;
const LABEL_MARGIN_BOTTOM = 2;
const BAR_HEIGHT = 14;
const BAR_RADIUS = 4;
const RESULT_FONT_SIZE = 12;
const RESULT_MARGIN_TOP = 2;
const PERCENT_FULL = 100;
const CHART_HORIZONTAL_INSET = 64;
const MIN_BAR_WIDTH = 120;

const styles = StyleSheet.create({
  container: {
    marginBottom: TITLE_MARGIN_BOTTOM,
  },
  title: {
    fontSize: TITLE_FONT_SIZE,
    fontWeight: '600',
    marginBottom: TITLE_MARGIN_BOTTOM,
  },
  row: {
    marginBottom: ROW_MARGIN_BOTTOM,
  },
  label: {
    fontSize: LABEL_FONT_SIZE,
    marginBottom: LABEL_MARGIN_BOTTOM,
  },
  result: {
    fontSize: RESULT_FONT_SIZE,
    marginTop: RESULT_MARGIN_TOP,
  },
});

interface OptionBarChartProps {
  questionName: string;
  options: OptionDistribution[];
}

const OptionBarChart = ({ questionName, options }: OptionBarChartProps): React.ReactElement => {
  const { theme } = useTheme();
  const { colors } = theme;
  const primary = theme.palette.primary['500'];
  const { width: screenWidth } = useWindowDimensions();
  const barWidth = Math.max(screenWidth - CHART_HORIZONTAL_INSET, MIN_BAR_WIDTH);

  return (
    <View style={styles.container} testID={TestIds.QUIZ_ANALYTICS_OPTION_CHART}>
      <Text style={[styles.title, { color: colors.text }]}>{questionName}</Text>
      {options.map((opt) => {
        const filled = (Math.min(opt.pct, PERCENT_FULL) / PERCENT_FULL) * barWidth;
        const pctLabel = String(Math.round(opt.pct));
        return (
          <View key={opt.value} style={styles.row}>
            <Text style={[styles.label, { color: colors.text }]}>{opt.label}</Text>
            <Svg height={BAR_HEIGHT} width={barWidth}>
              <Rect
                fill={colors.border}
                height={BAR_HEIGHT}
                rx={BAR_RADIUS}
                width={barWidth}
                x={0}
                y={0}
              />
              <Rect
                fill={primary}
                height={BAR_HEIGHT}
                rx={BAR_RADIUS}
                width={filled}
                x={0}
                y={0}
              />
            </Svg>
            <Text style={[styles.result, { color: colors.textSecondary }]}>
              {FM('quizAnalytics.optionResult', pctLabel, String(opt.count))}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

export default OptionBarChart;
