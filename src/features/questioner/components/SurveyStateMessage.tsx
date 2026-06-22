import React, { useMemo } from 'react';

import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import ErrorState from '../../../components/Shared/ErrorState';
import { FM } from '../../../localization/helpers';
import PublicSurveyState from '../../../shared/enums/PublicSurveyState';
import { TestIds } from '../../../shared/testIds';
import { useTheme } from '../../../theme/hooks/useTheme';
import { isValueDefined } from '../../../utils/is';

const SPACING = 8;
const PADDING = 16;

const styles = StyleSheet.create({
  container: { flex: 1, padding: PADDING, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: '600', textAlign: 'center', marginBottom: SPACING },
  message: { fontSize: 16, textAlign: 'center' },
  loadingText: { marginTop: SPACING, fontSize: 16 },
});

interface Props {
  state: PublicSurveyState;
  onRetry: () => void;
}

/** Maps a non-Ready public-survey state to its title id, message id, and testID. */
const STATE_COPY: Partial<Record<PublicSurveyState, { title: string; message: string; testID: string }>> = {
  [PublicSurveyState.NotFound]: {
    title: 'publicSurvey.unavailableTitle',
    message: 'publicSurvey.unavailableMessage',
    testID: TestIds.PUBLIC_SURVEY_UNAVAILABLE,
  },
  [PublicSurveyState.Closed]: {
    title: 'publicSurvey.closedTitle',
    message: 'publicSurvey.closedMessage',
    testID: TestIds.PUBLIC_SURVEY_CLOSED,
  },
};

/**
 * Renders the loading / unavailable / closed / error states for the public survey
 * (everything except the fillable form). Keeps the screen's branching low.
 */
const SurveyStateMessage = ({ state, onRetry }: Props): React.ReactElement | null => {
  const { theme } = useTheme();
  const colors = theme.colors;
  const titleStyle = useMemo(() => [styles.title, { color: String(colors.text) }], [colors.text]);
  const messageStyle = useMemo(() => [styles.message, { color: String(colors.textSecondary) }], [colors.textSecondary]);

  if (state === PublicSurveyState.Loading)
    return (
      <View style={styles.container} testID={TestIds.PUBLIC_SURVEY_LOADING}>
        <ActivityIndicator />
        <Text style={[styles.loadingText, messageStyle]}>{FM('publicSurvey.loading')}</Text>
      </View>
    );

  if (state === PublicSurveyState.Error)
    return <ErrorState message={FM('publicSurvey.errorMessage')} testID={TestIds.PUBLIC_SURVEY_ERROR} onRetry={onRetry} />;

  const copy = STATE_COPY[state];
  if (!isValueDefined(copy)) return null;

  return (
    <View style={styles.container} testID={copy.testID}>
      <Text style={titleStyle}>{FM(copy.title)}</Text>
      <Text style={messageStyle}>{FM(copy.message)}</Text>
    </View>
  );
};

export default SurveyStateMessage;
