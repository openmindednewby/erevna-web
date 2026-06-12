import React from 'react';

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useTheme } from '@/theme/hooks/useTheme';

import type { CrosstabQuestionOption } from '../../utils/analyticsTypes';

const LABEL_FONT_SIZE = 13;
const LABEL_MARGIN_BOTTOM = 4;
const CHIP_PADDING_V = 6;
const CHIP_PADDING_H = 10;
const CHIP_RADIUS = 6;
const CHIP_MARGIN = 4;
const CHIP_BORDER_WIDTH = 1;
const CHIP_FONT_SIZE = 13;
const GROUP_MARGIN_BOTTOM = 10;

const styles = StyleSheet.create({
  group: {
    marginBottom: GROUP_MARGIN_BOTTOM,
  },
  label: {
    fontSize: LABEL_FONT_SIZE,
    fontWeight: '600',
    marginBottom: LABEL_MARGIN_BOTTOM,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    paddingVertical: CHIP_PADDING_V,
    paddingHorizontal: CHIP_PADDING_H,
    borderRadius: CHIP_RADIUS,
    borderWidth: CHIP_BORDER_WIDTH,
    margin: CHIP_MARGIN,
  },
  chipText: {
    fontSize: CHIP_FONT_SIZE,
  },
});

interface CrosstabPickerProps {
  label: string;
  pickerHint: string;
  options: CrosstabQuestionOption[];
  selectedId: string;
  optionLabel: (name: string) => string;
  onSelect: (questionId: string) => void;
  testID: string;
  optionTestId: string;
}

/** A labelled row of selectable question chips for one crosstab axis. */
const CrosstabPicker = ({
  label,
  pickerHint,
  options,
  selectedId,
  optionLabel,
  onSelect,
  testID,
  optionTestId,
}: CrosstabPickerProps): React.ReactElement => {
  const { theme } = useTheme();
  const { colors } = theme;
  const primary = theme.palette.primary['500'];

  return (
    <View accessibilityHint={pickerHint} accessibilityLabel={label} style={styles.group} testID={testID}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <View style={styles.chips}>
        {options.map((opt) => {
          const selected = opt.questionId === selectedId;
          const borderColor = selected ? primary : colors.border;
          const textColor = selected ? primary : colors.text;
          return (
            <TouchableOpacity
              key={opt.questionId}
              accessibilityHint={pickerHint}
              accessibilityLabel={optionLabel(opt.questionName)}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              style={[styles.chip, { borderColor }]}
              testID={`${optionTestId}-${opt.questionId}`}
              onPress={() => onSelect(opt.questionId)}
            >
              <Text style={[styles.chipText, { color: textColor }]}>{opt.questionName}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default CrosstabPicker;
