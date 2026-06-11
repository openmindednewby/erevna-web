import React from 'react';

import { TextInput, Text } from 'react-native';

import { FM } from '@/localization/helpers';

import { useTheme } from '../../../../theme/hooks/useTheme';
import { isValueDefined } from '../../../../utils/is';

import type { FormStyles } from '../../../../theme/utils/styles';

interface Props {
  value: number | null;
  errorMsg?: string;
  updateAnswer: (v: number | null) => void;
  styles: FormStyles;
}

/** Parse free numeric input, treating blanks/invalid as cleared (null). */
function parseNumeric(text: string): number | null {
  const trimmed = text.trim();
  if (trimmed === '') return null;
  const parsed = Number(trimmed);
  return Number.isNaN(parsed) ? null : parsed;
}

export const NumberQuestion: React.FC<Props> = ({ value, errorMsg, updateAnswer, styles }) => {
  const { theme } = useTheme();
  const hasError = typeof errorMsg === 'string' && errorMsg !== '';
  const displayValue = !isValueDefined(value) ? '' : String(value);
  return (
    <>
      <TextInput
        accessibilityHint={FM('quizActive.numberHint')}
        accessibilityLabel={FM('quizActive.numberInputLabel')}
        inputMode="numeric"
        keyboardType="numeric"
        placeholder={FM('quizActive.numberPlaceholder')}
        placeholderTextColor={theme.colors.textSecondary}
        style={[styles.input, hasError ? styles.errorBorder : null]}
        testID="number-input"
        value={displayValue}
        onChangeText={(text) => updateAnswer(parseNumeric(text))}
      />
      {hasError ? <Text style={styles.errorText}>{errorMsg}</Text> : null}
    </>
  );
};
