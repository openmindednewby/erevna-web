import React from 'react';

import { StyleSheet, Text, TextInput, View } from 'react-native';

import { useTheme } from '@/theme/hooks/useTheme';

interface Props {
  label: string;
  value: string;
  accessibilityLabel: string;
  accessibilityHint: string;
  testID: string;
  onChange: (value: string) => void;
}

const styles = StyleSheet.create({
  wrapper: { marginTop: 6 },
  input: { padding: 6, marginTop: 4 },
});

/** Labeled free-text input used by the scale and validation-rule editors. */
const TextFieldRow = ({ label, value, accessibilityLabel, accessibilityHint, testID, onChange }: Props): React.ReactElement => {
  const { theme } = useTheme();
  const inputStyle = [styles.input, { backgroundColor: theme.colors.surface, color: theme.colors.text }];
  return (
    <View style={styles.wrapper}>
      <Text>{label}</Text>
      <TextInput
        accessibilityHint={accessibilityHint}
        accessibilityLabel={accessibilityLabel}
        style={inputStyle}
        testID={testID}
        value={value}
        onChangeText={onChange}
      />
    </View>
  );
};

export default TextFieldRow;
