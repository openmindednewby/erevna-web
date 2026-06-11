import React from 'react';

import { StyleSheet, Text, TextInput, View } from 'react-native';

import { useTheme } from '@/theme/hooks/useTheme';
import { isValueDefined } from '@/utils/is';

interface Props {
  label: string;
  value: number | undefined;
  accessibilityLabel: string;
  accessibilityHint: string;
  testID: string;
  onChange: (value: number | undefined) => void;
}

const styles = StyleSheet.create({
  wrapper: { marginTop: 6 },
  input: { padding: 6, marginTop: 4 },
});

/** Parse numeric text input; blank/invalid clears the value (undefined). */
function parse(text: string): number | undefined {
  const trimmed = text.trim();
  if (trimmed === '') return undefined;
  const parsed = Number(trimmed);
  return Number.isNaN(parsed) ? undefined : parsed;
}

/** Labeled numeric input used by the scale and validation-rule editors. */
const NumberField = ({ label, value, accessibilityLabel, accessibilityHint, testID, onChange }: Props): React.ReactElement => {
  const { theme } = useTheme();
  const inputStyle = [styles.input, { backgroundColor: theme.colors.surface, color: theme.colors.text }];
  return (
    <View style={styles.wrapper}>
      <Text>{label}</Text>
      <TextInput
        accessibilityHint={accessibilityHint}
        accessibilityLabel={accessibilityLabel}
        inputMode="numeric"
        keyboardType="numeric"
        style={inputStyle}
        testID={testID}
        value={!isValueDefined(value) ? '' : String(value)}
        onChangeText={(text) => onChange(parse(text))}
      />
    </View>
  );
};

export default NumberField;
