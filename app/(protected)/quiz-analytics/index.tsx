import React from 'react';

import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import PageHeaderWithActions from '../../../src/components/Shared/PageHeaderWithActions';
import QuestionSections from '../../../src/features/questioner/components/analytics/QuestionSections';
import ResponsesTimeline from '../../../src/features/questioner/components/analytics/ResponsesTimeline';
import StatCard from '../../../src/features/questioner/components/analytics/StatCard';
import { FM } from '../../../src/localization/helpers';
import { useQuizAnalytics } from '../../../src/server/customHooks/useQuizAnalytics';
import { TestIds } from '../../../src/shared/testIds';
import { useTheme } from '../../../src/theme/hooks/useTheme';
import { isValueDefined } from '../../../src/utils/is';

import type { AnalyticsStats } from '../../../src/features/questioner/utils/analyticsAggregator';

const CONTENT_PADDING = 16;
const TIMELINE_MARGIN_VERTICAL = 24;
const EMPTY_TITLE_FONT_SIZE = 18;
const EMPTY_TITLE_MARGIN_BOTTOM = 8;
const EMPTY_BODY_FONT_SIZE = 14;
const EMPTY_PADDING = 24;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: CONTENT_PADDING,
  },
  timeline: {
    marginVertical: TIMELINE_MARGIN_VERTICAL,
  },
  emptyContainer: {
    padding: EMPTY_PADDING,
  },
  emptyTitle: {
    fontSize: EMPTY_TITLE_FONT_SIZE,
    fontWeight: '600',
    marginBottom: EMPTY_TITLE_MARGIN_BOTTOM,
  },
  emptyBody: {
    fontSize: EMPTY_BODY_FONT_SIZE,
  },
});

interface EmptyStateProps {
  message: string;
  titleColor: string;
  bodyColor: string;
}

const EmptyState = ({ message, titleColor, bodyColor }: EmptyStateProps): React.ReactElement => (
  <View style={styles.emptyContainer} testID={TestIds.QUIZ_ANALYTICS_EMPTY}>
    <Text style={[styles.emptyTitle, { color: titleColor }]}>
      {FM('quizAnalytics.empty.title')}
    </Text>
    <Text style={[styles.emptyBody, { color: bodyColor }]}>{message}</Text>
  </View>
);

const ReadyState = ({ stats }: { stats: AnalyticsStats }): React.ReactElement => (
  <ScrollView contentContainerStyle={styles.content}>
    <StatCard
      accessibilityHint={FM('quizAnalytics.totalResponsesHint')}
      accessibilityLabel={FM('quizAnalytics.totalResponses')}
      label={FM('quizAnalytics.totalResponses')}
      testID={TestIds.QUIZ_ANALYTICS_STAT_TOTAL}
      value={String(stats.totalResponses)}
    />
    <View style={styles.timeline}>
      <ResponsesTimeline data={stats.responsesByDay} />
    </View>
    <QuestionSections stats={stats} />
  </ScrollView>
);

const QuizAnalyticsPage = (): React.ReactElement => {
  const { theme } = useTheme();
  const { colors } = theme;
  const { stats, activeTemplate, isLoading, refetch } = useQuizAnalytics();

  const hasActiveTemplate = isValueDefined(activeTemplate);
  const isEmpty = !hasActiveTemplate || stats.totalResponses === 0;

  const emptyMessage = hasActiveTemplate
    ? FM('quizAnalytics.empty.description')
    : FM('quizAnalytics.empty.noActiveTemplate');

  const renderBody = (): React.ReactElement => {
    if (isLoading) return <ActivityIndicator testID={TestIds.QUIZ_ANALYTICS_LOADING} />;
    if (isEmpty)
      return <EmptyState bodyColor={colors.textSecondary} message={emptyMessage} titleColor={colors.text} />;
    return <ReadyState stats={stats} />;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]} testID={TestIds.QUIZ_ANALYTICS_PAGE}>
      <View style={styles.content}>
        <PageHeaderWithActions
          refreshing={isLoading}
          refreshLabel={FM('common.refresh')}
          title={FM('quizAnalytics.title')}
          onRefresh={refetch}
        />
      </View>
      {renderBody()}
    </View>
  );
};

export default QuizAnalyticsPage;
