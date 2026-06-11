import React from 'react';

import { Platform, TextInput, Text } from 'react-native';

import { FM } from '@/localization/helpers';

import { useTheme } from '../../../../theme/hooks/useTheme';

import type { FormStyles } from '../../../../theme/utils/styles';

interface Props {
  value: string;
  errorMsg?: string;
  updateAnswer: (v: string) => void;
  styles: FormStyles;
}

const ISO_DATE_LENGTH = 'yyyy-MM-dd'.length;

// On web, RN-web forwards unknown props to the DOM <input>, so `type: 'date'`
// upgrades to the browser's native date picker. Native platforms ignore it and
// fall back to a masked ISO text input. Typed loosely to allow the web-only prop.
const WEB_DATE_PROPS: Record<string, string> = Platform.OS === 'web' ? { type: 'date' } : {};

export const DateQuestion: React.FC<Props> = ({ value, errorMsg, updateAnswer, styles }) => {
  const { theme } = useTheme();
  const hasError = typeof errorMsg === 'string' && errorMsg !== '';
  return (
    <>
      <TextInput
        accessibilityHint={FM('quizActive.dateHint')}
        accessibilityLabel={FM('quizActive.dateInputLabel')}
        inputMode="text"
        maxLength={ISO_DATE_LENGTH}
        placeholder={FM('quizActive.datePlaceholder')}
        placeholderTextColor={theme.colors.textSecondary}
        style={[styles.input, hasError ? styles.errorBorder : null]}
        testID="date-input"
        value={value}
        onChangeText={updateAnswer}
        {...WEB_DATE_PROPS}
      />
      {hasError ? <Text style={styles.errorText}>{errorMsg}</Text> : null}
    </>
  );
};
