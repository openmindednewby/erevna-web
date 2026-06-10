import React, { useMemo } from 'react';

import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import Svg, { Rect } from 'react-native-svg';

import { FM } from '@/localization/helpers';
import { TestIds } from '@/shared/testIds';
import { useTheme } from '@/theme/hooks/useTheme';

import type { ResponsesByDayEntry } from '../../utils/analyticsAggregator';

const TITLE_FONT_SIZE = 15;
const TITLE_MARGIN_BOTTOM = 10;
const CHART_HEIGHT = 140;
const CHART_PADDING_BOTTOM = 4;
const BAR_GAP = 6;
const BAR_RADIUS = 3;
const CHART_HORIZONTAL_INSET = 64;
const MIN_CHART_WIDTH = 120;
const MIN_COUNT_FOR_SCALE = 1;
const EMPTY_FONT_SIZE = 14;
const EMPTY_PADDING_VERTICAL = 16;
const SR_MARGIN_TOP = 8;

const styles = StyleSheet.create({
  title: {
    fontSize: TITLE_FONT_SIZE,
    fontWeight: '600',
    marginBottom: TITLE_MARGIN_BOTTOM,
  },
  emptyText: {
    fontSize: EMPTY_FONT_SIZE,
    paddingVertical: EMPTY_PADDING_VERTICAL,
  },
  srText: {
    marginTop: SR_MARGIN_TOP,
  },
});

interface ResponsesTimelineProps {
  data: ResponsesByDayEntry[];
}

const ResponsesTimeline = ({ data }: ResponsesTimelineProps): React.ReactElement => {
  const { theme } = useTheme();
  const { colors } = theme;
  const primary = theme.palette.primary['500'];
  const { width: screenWidth } = useWindowDimensions();
  const chartWidth = Math.max(screenWidth - CHART_HORIZONTAL_INSET, MIN_CHART_WIDTH);

  const bars = useMemo(() => {
    if (data.length === 0) return [];
    const max = Math.max(...data.map((d) => d.count), MIN_COUNT_FOR_SCALE);
    const drawHeight = CHART_HEIGHT - CHART_PADDING_BOTTOM;
    const slotWidth = chartWidth / data.length;
    const barWidth = Math.max(slotWidth - BAR_GAP, MIN_COUNT_FOR_SCALE);

    return data.map((entry, index) => {
      const height = (entry.count / max) * drawHeight;
      return {
        key: entry.day,
        x: index * slotWidth,
        y: drawHeight - height,
        width: barWidth,
        height,
      };
    });
  }, [data, chartWidth]);

  const srSummary = useMemo(
    () => data.map((d) => FM('quizAnalytics.dayCount', d.day, String(d.count))).join(', '),
    [data],
  );

  return (
    <View testID={TestIds.QUIZ_ANALYTICS_TIMELINE}>
      <Text style={[styles.title, { color: colors.text }]}>
        {FM('quizAnalytics.responsesOverTime')}
      </Text>
      {data.length === 0 ? (
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          {FM('quizAnalytics.noChartData')}
        </Text>
      ) : (
        <>
          <Svg height={CHART_HEIGHT} width={chartWidth}>
            {bars.map((bar) => (
              <Rect
                key={bar.key}
                fill={primary}
                height={bar.height}
                rx={BAR_RADIUS}
                width={bar.width}
                x={bar.x}
                y={bar.y}
              />
            ))}
          </Svg>
          <Text style={[styles.srText, { color: colors.textSecondary }]}>{srSummary}</Text>
        </>
      )}
    </View>
  );
};

export default ResponsesTimeline;
