import React from 'react';

import { StyleSheet, Text, TextInput, View } from 'react-native';

import { FM } from '@/localization/helpers';
import { TestIds } from '@/shared/testIds';
import { useTheme } from '@/theme/hooks/useTheme';
import { layoutStyles } from '@/theme/utils/styles';

const styles = StyleSheet.create({
  helpText: { fontSize: 12, marginTop: 2 },
});

interface Props {
  /** Date-only (YYYY-MM-DD) raw input value for the soft-closing date. */
  closingDate: string;
  /** Raw numeric-text input value for the response quota. */
  maxResponses: string;
  onClosingDateChange: (value: string) => void;
  onMaxResponsesChange: (value: string) => void;
  readOnly?: boolean;
}

/**
 * Editor fields for survey availability: an optional soft-closing date and an
 * optional response quota. Both raw string values are owned by the parent; the
 * save path normalises them via availabilityHelpers.
 */
const TemplateAvailabilityFields = ({
  closingDate,
  maxResponses,
  onClosingDateChange,
  onMaxResponsesChange,
  readOnly = false,
}: Props): React.ReactElement => {
  const { theme } = useTheme();
  const colors = theme.colors;

  const inputStyle = React.useMemo(
    () => [layoutStyles.input, { backgroundColor: colors.surface, color: colors.text }],
    [colors.surface, colors.text],
  );
  const labelStyle = React.useMemo(() => [layoutStyles.inputLabel, { color: colors.text }], [colors.text]);
  const helpStyle = React.useMemo(() => [styles.helpText, { color: colors.textSecondary }], [colors.textSecondary]);

  return (
    <View style={layoutStyles.sectionSpacing}>
      <Text style={labelStyle}>{FM('quizTemplates.label.closingDate')}</Text>
      <TextInput
        accessibilityHint={FM('quizTemplates.closingDateHint')}
        accessibilityLabel={FM('quizTemplates.label.closingDate')}
        editable={!readOnly}
        placeholder={FM('quizTemplates.closingDatePlaceholder')}
        style={inputStyle}
        testID={TestIds.TEMPLATE_CLOSING_DATE_INPUT}
        value={closingDate}
        onChangeText={onClosingDateChange}
      />
      <Text style={helpStyle}>{FM('quizTemplates.closingDateHelp')}</Text>

      <Text style={[labelStyle, layoutStyles.inputSpacing]}>{FM('quizTemplates.label.maxResponses')}</Text>
      <TextInput
        accessibilityHint={FM('quizTemplates.maxResponsesHint')}
        accessibilityLabel={FM('quizTemplates.label.maxResponses')}
        editable={!readOnly}
        keyboardType="number-pad"
        placeholder={FM('quizTemplates.maxResponsesPlaceholder')}
        style={inputStyle}
        testID={TestIds.TEMPLATE_MAX_RESPONSES_INPUT}
        value={maxResponses}
        onChangeText={onMaxResponsesChange}
      />
      <Text style={helpStyle}>{FM('quizTemplates.maxResponsesHelp')}</Text>
    </View>
  );
};

export default TemplateAvailabilityFields;
