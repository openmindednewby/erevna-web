import React from 'react';

import { Text, View } from 'react-native';

import { RequiredMark } from './components/RequiredMark';
import { isValueDefined } from '../../../utils/is';
import { getEntryByUiType } from '../questionTypes/registry';


import type { FormStyles } from '../../../theme/utils/styles';
import type { Answer, Question } from '../interfaces';

interface Props {
  question: Question;
  value: Answer;
  errorMsg?: string;
  updateAnswer: (questionId: string, value: Answer) => void;
  shouldSkip: (q: Question) => boolean;
  styles: FormStyles;
}

const QuestionRenderer: React.FC<Props> = ({ question, value, errorMsg, updateAnswer, shouldSkip, styles }) => {
  if (shouldSkip(question)) return null;

  const entry = getEntryByUiType(question.type);
  const body = entry.render({
    errorMsg,
    question,
    styles,
    updateAnswer: (v: Answer) => updateAnswer(question.id, v),
    value,
  });
  if (!isValueDefined(body)) return null;

  return (
    <View key={question.id} style={styles.questionBlock}>
      <View style={styles.questionHeaderRow}>
        <Text style={styles.questionTitle}>{question.name}</Text>
        {question.isRequired === true ? <RequiredMark styles={styles} /> : null}
      </View>
      {body}
    </View>
  );
};

export default QuestionRenderer;
