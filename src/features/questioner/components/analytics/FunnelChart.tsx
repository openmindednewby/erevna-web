import React from 'react';

import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import Svg, { Rect } from 'react-native-svg';

import { FM } from '@/localization/helpers';
import { TestIds } from '@/shared/testIds';
import { useTheme } from '@/theme/hooks/useTheme';

import type { FunnelPageStep, FunnelQuestionStep, FunnelStats } from '../../utils/analyticsTypes';

const TITLE_FONT_SIZE = 15;
const TITLE_MARGIN_BOTTOM = 6;
const CAVEAT_FONT_SIZE = 12;
const CAVEAT_MARGIN_BOTTOM = 14;
const SUBTITLE_FONT_SIZE = 13;
const SUBTITLE_MARGIN = 10;
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
const EMPTY_FONT_SIZE = 14;
const EMPTY_PADDING_VERTICAL = 16;

const styles = StyleSheet.create({
  container: {
    marginBottom: TITLE_MARGIN_BOTTOM,
  },
  title: {
    fontSize: TITLE_FONT_SIZE,
    fontWeight: '600',
    marginBottom: TITLE_MARGIN_BOTTOM,
  },
  caveat: {
    fontSize: CAVEAT_FONT_SIZE,
    fontStyle: 'italic',
    marginBottom: CAVEAT_MARGIN_BOTTOM,
  },
  subtitle: {
    fontSize: SUBTITLE_FONT_SIZE,
    fontWeight: '600',
    marginTop: SUBTITLE_MARGIN,
    marginBottom: SUBTITLE_MARGIN,
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
  emptyText: {
    fontSize: EMPTY_FONT_SIZE,
    paddingVertical: EMPTY_PADDING_VERTICAL,
  },
});

interface BarRowProps {
  label: string;
  result: string;
  pct: number;
  barWidth: number;
}

const BarRow = ({ label, result, pct, barWidth }: BarRowProps): React.ReactElement => {
  const { theme } = useTheme();
  const { colors } = theme;
  const primary = theme.palette.primary['500'];
  const filled = (Math.min(pct, PERCENT_FULL) / PERCENT_FULL) * barWidth;
  return (
    <View style={styles.row}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <Svg height={BAR_HEIGHT} width={barWidth}>
        <Rect fill={colors.border} height={BAR_HEIGHT} rx={BAR_RADIUS} width={barWidth} x={0} y={0} />
        <Rect fill={primary} height={BAR_HEIGHT} rx={BAR_RADIUS} width={filled} x={0} y={0} />
      </Svg>
      <Text style={[styles.result, { color: colors.textSecondary }]}>{result}</Text>
    </View>
  );
};

function pageRow(step: FunnelPageStep, barWidth: number): React.ReactElement {
  return (
    <BarRow
      key={`page-${step.page}`}
      barWidth={barWidth}
      label={FM('quizAnalytics.funnel.pageLabel', String(step.page))}
      pct={step.reachedPct}
      result={FM(
        'quizAnalytics.funnel.pageResult',
        String(Math.round(step.reachedPct)),
        String(step.reached),
        String(step.total),
      )}
    />
  );
}

function questionRow(step: FunnelQuestionStep, barWidth: number): React.ReactElement {
  return (
    <BarRow
      key={`q-${step.questionId}`}
      barWidth={barWidth}
      label={step.questionName}
      pct={step.answeredPct}
      result={FM(
        'quizAnalytics.funnel.questionResult',
        String(Math.round(step.answeredPct)),
        String(step.answered),
        String(step.total),
      )}
    />
  );
}

interface FunnelChartProps {
  funnel: FunnelStats;
}

/**
 * Renders the COMPLETION / ANSWERED-RATE funnel (NOT abandonment drop-off — only completed
 * responses are stored). Shows per-page reach and per-question answered rate as SVG bars,
 * with an explicit caveat line so the data is never misread as drop-off.
 */
const FunnelChart = ({ funnel }: FunnelChartProps): React.ReactElement => {
  const { theme } = useTheme();
  const { colors } = theme;
  const { width: screenWidth } = useWindowDimensions();
  const barWidth = Math.max(screenWidth - CHART_HORIZONTAL_INSET, MIN_BAR_WIDTH);
  const hasData = funnel.questionSteps.length > 0;

  return (
    <View style={styles.container} testID={TestIds.QUIZ_ANALYTICS_FUNNEL}>
      <Text style={[styles.title, { color: colors.text }]}>{FM('quizAnalytics.funnel.title')}</Text>
      <Text style={[styles.caveat, { color: colors.textSecondary }]}>
        {FM('quizAnalytics.funnel.caveat')}
      </Text>
      {hasData ? (
        <>
          <Text style={[styles.subtitle, { color: colors.text }]}>{FM('quizAnalytics.funnel.byPage')}</Text>
          {funnel.pageSteps.map((step) => pageRow(step, barWidth))}
          <Text style={[styles.subtitle, { color: colors.text }]}>{FM('quizAnalytics.funnel.byQuestion')}</Text>
          {funnel.questionSteps.map((step) => questionRow(step, barWidth))}
        </>
      ) : (
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          {FM('quizAnalytics.funnel.empty')}
        </Text>
      )}
    </View>
  );
};

export default FunnelChart;
