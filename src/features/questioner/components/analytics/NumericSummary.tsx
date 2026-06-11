import React from 'react';

import { StyleSheet, Text, View } from 'react-native';

import { FM } from '@/localization/helpers';
import { TestIds } from '@/shared/testIds';
import { useTheme } from '@/theme/hooks/useTheme';

import type { NumericQuestionStats } from '../../utils/analyticsAggregator';

const TITLE_FONT_SIZE = 15;
const TITLE_MARGIN_BOTTOM = 8;
const META_FONT_SIZE = 12;
const META_MARGIN_BOTTOM = 8;
const BUCKET_FONT_SIZE = 14;
const BUCKET_PADDING = 8;
const BUCKET_RADIUS = 8;
const BUCKET_MARGIN_BOTTOM = 6;
const AVERAGE_DECIMALS = 2;

const styles = StyleSheet.create({
  title: { fontSize: TITLE_FONT_SIZE, fontWeight: '600', marginBottom: TITLE_MARGIN_BOTTOM },
  meta: { fontSize: META_FONT_SIZE, marginBottom: META_MARGIN_BOTTOM },
  bucket: { fontSize: BUCKET_FONT_SIZE, padding: BUCKET_PADDING, borderRadius: BUCKET_RADIUS, marginBottom: BUCKET_MARGIN_BOTTOM },
});

interface Props {
  stats: NumericQuestionStats;
}

/** Average + value distribution for one numeric question (Rating/Nps/Number/LinearScale). */
const NumericSummary = ({ stats }: Props): React.ReactElement => {
  const { theme } = useTheme();
  const { colors } = theme;
  const hasData = stats.count > 0;
  return (
    <View testID={TestIds.QUIZ_ANALYTICS_NUMERIC_SUMMARY}>
      <Text style={[styles.title, { color: colors.text }]}>{stats.questionName}</Text>
      {hasData ? (
        <>
          <Text style={[styles.meta, { color: colors.textSecondary }]}>
            {FM('quizAnalytics.average', stats.average.toFixed(AVERAGE_DECIMALS))}
          </Text>
          <Text style={[styles.meta, { color: colors.textSecondary }]}>
            {FM('quizAnalytics.numericResponseCount', String(stats.count))}
          </Text>
          {stats.distribution.map((bucket) => (
            <Text
              key={String(bucket.value)}
              style={[styles.bucket, { color: colors.text, backgroundColor: colors.surface }]}
            >
              {FM('quizAnalytics.numericBucket', String(bucket.value), String(bucket.count))}
            </Text>
          ))}
        </>
      ) : (
        <Text style={[styles.meta, { color: colors.textSecondary }]}>
          {FM('quizAnalytics.noNumericAnswers')}
        </Text>
      )}
    </View>
  );
};

export default NumericSummary;
