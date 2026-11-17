import React from 'react';

import { DateField } from '@dloizides/ui-forms';

import { FM } from '@/localization/helpers';

interface Props {
  value: string;
  errorMsg?: string;
  updateAnswer: (v: string) => void;
}

export const DateQuestion: React.FC<Props> = ({ value, errorMsg, updateAnswer }) => {
  const hasError = typeof errorMsg === 'string' && errorMsg !== '';
  return (
    <DateField
      accessibilityHint={FM('quizActive.dateHint')}
      error={hasError ? errorMsg : undefined}
      label={FM('quizActive.dateInputLabel')}
      testID="date-input"
      value={value}
      onChange={updateAnswer}
    />
  );
};
