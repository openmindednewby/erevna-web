import React from 'react';

import { StyleSheet, View } from 'react-native';

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

/** Renders one section per question: bar chart for choice types, list for text types. */
const QuestionSections = ({ stats }: QuestionSectionsProps): React.ReactElement => (
  <>
    {stats.choiceQuestions.map((q) => (
      <View key={q.questionId} style={styles.section}>
        <OptionBarChart options={q.options} questionName={q.questionName} />
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
