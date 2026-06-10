import React from 'react';

import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { FM } from '@/localization/helpers';
import { TestIds } from '@/shared/testIds';
import { useTheme } from '@/theme/hooks/useTheme';

const TITLE_FONT_SIZE = 15;
const TITLE_MARGIN_BOTTOM = 8;
const COUNT_FONT_SIZE = 12;
const COUNT_MARGIN_BOTTOM = 8;
const ANSWER_FONT_SIZE = 14;
const ANSWER_PADDING = 10;
const ANSWER_RADIUS = 8;
const ANSWER_MARGIN_BOTTOM = 6;
const LIST_MAX_HEIGHT = 240;
const EMPTY_FONT_SIZE = 14;
const EMPTY_PADDING_VERTICAL = 12;

const styles = StyleSheet.create({
  title: {
    fontSize: TITLE_FONT_SIZE,
    fontWeight: '600',
    marginBottom: TITLE_MARGIN_BOTTOM,
  },
  count: {
    fontSize: COUNT_FONT_SIZE,
    marginBottom: COUNT_MARGIN_BOTTOM,
  },
  list: {
    maxHeight: LIST_MAX_HEIGHT,
  },
  answer: {
    fontSize: ANSWER_FONT_SIZE,
    padding: ANSWER_PADDING,
    borderRadius: ANSWER_RADIUS,
    marginBottom: ANSWER_MARGIN_BOTTOM,
  },
  emptyText: {
    fontSize: EMPTY_FONT_SIZE,
    paddingVertical: EMPTY_PADDING_VERTICAL,
  },
});

interface TextAnswerListProps {
  questionName: string;
  answers: string[];
}

const TextAnswerList = ({ questionName, answers }: TextAnswerListProps): React.ReactElement => {
  const { theme } = useTheme();
  const { colors } = theme;

  return (
    <View testID={TestIds.QUIZ_ANALYTICS_TEXT_LIST}>
      <Text style={[styles.title, { color: colors.text }]}>{questionName}</Text>
      {answers.length === 0 ? (
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          {FM('quizAnalytics.noTextAnswers')}
        </Text>
      ) : (
        <>
          <Text style={[styles.count, { color: colors.textSecondary }]}>
            {FM('quizAnalytics.textAnswerCount', String(answers.length))}
          </Text>
          <ScrollView style={styles.list}>
            {answers.map((answer, index) => (
              <Text
                key={`${answer}-${String(index)}`}
                style={[styles.answer, { color: colors.text, backgroundColor: colors.surface }]}
              >
                {answer}
              </Text>
            ))}
          </ScrollView>
        </>
      )}
    </View>
  );
};

export default TextAnswerList;
