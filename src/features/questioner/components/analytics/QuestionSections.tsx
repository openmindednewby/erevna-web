import React from 'react';

import { StyleSheet, View } from 'react-native';

import DateAnswerList from './DateAnswerList';
import NumericSummary from './NumericSummary';
import OptionBarChart from './OptionBarChart';
import TextAnswerList from './TextAnswerList';

import type { AnalyticsStats } from '../../utils/analyticsAggregator';

const SECTION_MARGIN_BOTTOM = 24;

const styles = StyleSheet.create({
  section: {
    marginBottom: SECTION_MARGIN_BOTTOM,
  },
});

interface QuestionSectionsProps {
  stats: AnalyticsStats;
}

/** Renders one section per question: bar chart for choice types, average+distribution for
 * numeric types, a date list for date types, and a list for text types. */
const QuestionSections = ({ stats }: QuestionSectionsProps): React.ReactElement => (
  <>
    {stats.choiceQuestions.map((q) => (
      <View key={q.questionId} style={styles.section}>
        <OptionBarChart options={q.options} questionName={q.questionName} />
      </View>
    ))}
    {stats.numericQuestions.map((q) => (
      <View key={q.questionId} style={styles.section}>
        <NumericSummary stats={q} />
      </View>
    ))}
    {stats.dateQuestions.map((q) => (
      <View key={q.questionId} style={styles.section}>
        <DateAnswerList stats={q} />
      </View>
    ))}
    {stats.textQuestions.map((q) => (
      <View key={q.questionId} style={styles.section}>
        <TextAnswerList answers={q.answers} questionName={q.questionName} />
      </View>
    ))}
  </>
);

export default QuestionSections;
