import React, { useMemo } from 'react';

import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { FM } from '../../../localization/helpers';
import { TestIds } from '../../../shared/testIds';
import { useTheme } from '../../../theme/hooks/useTheme';
import { isValueDefined } from '../../../utils/is';

const styles = StyleSheet.create({
  wrapper: { marginTop: 16, alignItems: 'center' },
  button: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, borderWidth: 1 },
  resumeText: { fontSize: 13, marginTop: 8, textAlign: 'center' },
  link: { fontSize: 13, marginTop: 2, textAlign: 'center' },
});

interface Props {
  isSaving: boolean;
  resumeUrl: string;
  onSave: () => void;
}

/**
 * "Save & continue later" control for the public survey. After a save it shows
 * the shareable resume link the respondent can revisit to finish later.
 */
const SurveyDraftRow = ({ isSaving, resumeUrl, onSave }: Props): React.ReactElement => {
  const { theme } = useTheme();
  const colors = theme.colors;
  const buttonStyle = useMemo(() => [styles.button, { borderColor: colors.border }], [colors.border]);
  const labelStyle = useMemo(() => ({ color: String(colors.text) }), [colors.text]);
  const mutedStyle = useMemo(() => [styles.resumeText, { color: colors.textSecondary }], [colors.textSecondary]);
  const linkStyle = useMemo(() => [styles.link, { color: theme.palette.primary['500'] }], [theme.palette.primary]);
  const hasLink = isValueDefined(resumeUrl) && resumeUrl !== '';

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        accessibilityHint={FM('publicSurvey.saveDraftHint')}
        accessibilityLabel={FM('publicSurvey.saveDraft')}
        accessibilityRole="button"
        disabled={isSaving}
        style={buttonStyle}
        testID={TestIds.PUBLIC_SURVEY_SAVE_DRAFT_BUTTON}
        onPress={onSave}
      >
        {isSaving ? <ActivityIndicator /> : <Text style={labelStyle}>{FM('publicSurvey.saveDraft')}</Text>}
      </TouchableOpacity>

      {hasLink ? (
        <View testID={TestIds.PUBLIC_SURVEY_RESUME_LINK}>
          <Text style={mutedStyle}>{FM('publicSurvey.resumeSaved')}</Text>
          <Text selectable style={linkStyle}>{resumeUrl}</Text>
        </View>
      ) : null}
    </View>
  );
};

export default SurveyDraftRow;
