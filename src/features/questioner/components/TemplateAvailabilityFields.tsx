import React from 'react';

import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { FM } from '@/localization/helpers';
import RespondentContactMode from '@/shared/enums/RespondentContactMode';
import { TestIds } from '@/shared/testIds';
import { useTheme } from '@/theme/hooks/useTheme';
import { layoutStyles } from '@/theme/utils/styles';

const TRANSPARENT_COLOR = 'transparent';
const WHITE_COLOR = '#fff';

const styles = StyleSheet.create({
  helpText: { fontSize: 12, marginTop: 2 },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 4 },
  pill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginRight: 8, marginBottom: 4 },
});

interface ContactModeOption {
  mode: RespondentContactMode;
  labelKey: string;
  testID: string;
}

const CONTACT_MODE_OPTIONS: ContactModeOption[] = [
  { mode: RespondentContactMode.Anonymous, labelKey: 'quizTemplates.contactMode.anonymous', testID: TestIds.TEMPLATE_CONTACT_MODE_ANONYMOUS },
  { mode: RespondentContactMode.Optional, labelKey: 'quizTemplates.contactMode.optional', testID: TestIds.TEMPLATE_CONTACT_MODE_OPTIONAL },
  { mode: RespondentContactMode.Required, labelKey: 'quizTemplates.contactMode.required', testID: TestIds.TEMPLATE_CONTACT_MODE_REQUIRED },
];

interface Props {
  /** Date-only (YYYY-MM-DD) raw input value for the soft-closing date. */
  closingDate: string;
  /** Raw numeric-text input value for the response quota. */
  maxResponses: string;
  /** Respondent identity collection mode. */
  respondentContactMode: RespondentContactMode;
  onClosingDateChange: (value: string) => void;
  onMaxResponsesChange: (value: string) => void;
  onRespondentContactModeChange: (mode: RespondentContactMode) => void;
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
  respondentContactMode,
  onClosingDateChange,
  onMaxResponsesChange,
  onRespondentContactModeChange,
  readOnly = false,
}: Props): React.ReactElement => {
  const { theme } = useTheme();
  const colors = theme.colors;
  const primary = theme.palette.primary['500'];

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

      <Text style={[labelStyle, layoutStyles.inputSpacing]}>{FM('quizTemplates.label.respondentContact')}</Text>
      <View style={styles.pillRow}>
        {CONTACT_MODE_OPTIONS.map((option) => {
          const selected = respondentContactMode === option.mode;
          return (
            <TouchableOpacity
              key={option.testID}
              accessibilityHint={FM('quizTemplates.contactModeHint')}
              accessibilityLabel={FM(option.labelKey)}
              accessibilityRole="button"
              disabled={readOnly}
              style={[styles.pill, { backgroundColor: selected ? primary : TRANSPARENT_COLOR }]}
              testID={option.testID}
              onPress={() => onRespondentContactModeChange(option.mode)}
            >
              <Text style={{ color: selected ? WHITE_COLOR : colors.textSecondary }}>{FM(option.labelKey)}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <Text style={helpStyle}>{FM('quizTemplates.respondentContactHelp')}</Text>
    </View>
  );
};

export default TemplateAvailabilityFields;
