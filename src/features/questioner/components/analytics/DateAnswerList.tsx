import React from 'react';

import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { FM } from '@/localization/helpers';
import { TestIds } from '@/shared/testIds';
import { useTheme } from '@/theme/hooks/useTheme';

import type { DateQuestionStats } from '../../utils/analyticsAggregator';

const TITLE_FONT_SIZE = 15;
const TITLE_MARGIN_BOTTOM = 8;
const COUNT_FONT_SIZE = 12;
const COUNT_MARGIN_BOTTOM = 8;
const VALUE_FONT_SIZE = 14;
const VALUE_PADDING = 10;
const VALUE_RADIUS = 8;
const VALUE_MARGIN_BOTTOM = 6;
const LIST_MAX_HEIGHT = 240;
const EMPTY_FONT_SIZE = 14;
const EMPTY_PADDING_VERTICAL = 12;

const styles = StyleSheet.create({
  title: { fontSize: TITLE_FONT_SIZE, fontWeight: '600', marginBottom: TITLE_MARGIN_BOTTOM },
  count: { fontSize: COUNT_FONT_SIZE, marginBottom: COUNT_MARGIN_BOTTOM },
  list: { maxHeight: LIST_MAX_HEIGHT },
  value: { fontSize: VALUE_FONT_SIZE, padding: VALUE_PADDING, borderRadius: VALUE_RADIUS, marginBottom: VALUE_MARGIN_BOTTOM },
  emptyText: { fontSize: EMPTY_FONT_SIZE, paddingVertical: EMPTY_PADDING_VERTICAL },
});

interface Props {
  stats: DateQuestionStats;
}

/** Lists collected date answers for one date question. */
const DateAnswerList = ({ stats }: Props): React.ReactElement => {
  const { theme } = useTheme();
  const { colors } = theme;
  return (
    <View testID={TestIds.QUIZ_ANALYTICS_DATE_LIST}>
      <Text style={[styles.title, { color: colors.text }]}>{stats.questionName}</Text>
      {stats.values.length === 0 ? (
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          {FM('quizAnalytics.noDateAnswers')}
        </Text>
      ) : (
        <>
          <Text style={[styles.count, { color: colors.textSecondary }]}>
            {FM('quizAnalytics.dateAnswerCount', String(stats.values.length))}
          </Text>
          <ScrollView style={styles.list}>
            {stats.values.map((value, index) => (
              <Text
                key={`${value}-${String(index)}`}
                style={[styles.value, { color: colors.text, backgroundColor: colors.surface }]}
              >
                {value}
              </Text>
            ))}
          </ScrollView>
        </>
      )}
    </View>
  );
};

export default DateAnswerList;
