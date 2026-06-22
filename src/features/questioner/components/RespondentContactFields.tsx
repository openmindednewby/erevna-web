import React, { useMemo } from 'react';

import { StyleSheet, Text, TextInput, View } from 'react-native';

import { FM } from '../../../localization/helpers';
import RespondentContactMode from '../../../shared/enums/RespondentContactMode';
import { TestIds } from '../../../shared/testIds';
import { useTheme } from '../../../theme/hooks/useTheme';
import { layoutStyles } from '../../../theme/utils/styles';
import { isValueDefined } from '../../../utils/is';

import type { RespondentContactError } from '../utils/respondentContact';

const styles = StyleSheet.create({
  wrapper: { marginBottom: 16 },
  errorText: { fontSize: 13, marginTop: 4 },
});

interface Props {
  mode: RespondentContactMode;
  name: string;
  email: string;
  error: RespondentContactError;
  onNameChange: (v: string) => void;
  onEmailChange: (v: string) => void;
}

/**
 * Respondent identity inputs shown on the public survey when the template's
 * contact mode is Optional/Required. Required appends an asterisk to the labels.
 */
const RespondentContactFields = ({ mode, name, email, error, onNameChange, onEmailChange }: Props): React.ReactElement => {
  const { theme } = useTheme();
  const colors = theme.colors;
  const required = mode === RespondentContactMode.Required;
  const suffix = required ? ' *' : '';
  const nameLabel = `${FM('publicSurvey.respondentName')}${suffix}`;
  const emailLabel = `${FM('publicSurvey.respondentEmail')}${suffix}`;
  const errorMessage = error === 'name'
    ? FM('publicSurvey.respondentNameRequired')
    : FM('publicSurvey.respondentEmailInvalid');

  const inputStyle = useMemo(
    () => [layoutStyles.input, { backgroundColor: colors.surface, color: colors.text }],
    [colors.surface, colors.text],
  );
  const labelStyle = useMemo(() => [layoutStyles.inputLabel, { color: colors.text }], [colors.text]);
  const errorStyle = useMemo(() => [styles.errorText, { color: theme.semantic.error['500'] }], [theme.semantic.error]);

  return (
    <View style={styles.wrapper}>
      <Text style={labelStyle}>{nameLabel}</Text>
      <TextInput
        accessibilityHint={FM('publicSurvey.respondentNameHint')}
        accessibilityLabel={FM('publicSurvey.respondentName')}
        autoCapitalize="words"
        placeholder={FM('publicSurvey.respondentNamePlaceholder')}
        style={inputStyle}
        testID={TestIds.PUBLIC_SURVEY_RESPONDENT_NAME}
        value={name}
        onChangeText={onNameChange}
      />

      <Text style={[labelStyle, layoutStyles.inputSpacing]}>{emailLabel}</Text>
      <TextInput
        accessibilityHint={FM('publicSurvey.respondentEmailHint')}
        accessibilityLabel={FM('publicSurvey.respondentEmail')}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder={FM('publicSurvey.respondentEmailPlaceholder')}
        style={inputStyle}
        testID={TestIds.PUBLIC_SURVEY_RESPONDENT_EMAIL}
        value={email}
        onChangeText={onEmailChange}
      />

      {isValueDefined(error) ? <Text style={errorStyle}>{errorMessage}</Text> : null}
    </View>
  );
};

export default RespondentContactFields;
