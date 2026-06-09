/**
 * PublicSurveyScreen - the public, anonymous survey respondent UI.
 *
 * Reuses the exact pure fill stack (QuizContent + ThankYouOverlay via
 * useQuizForm) and renders friendly states for loading / not-available /
 * error. Lives outside the (protected) group; nothing here triggers the auth
 * gate.
 */
import React, { useMemo } from 'react';

import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import QuizContent from '../../../../app/(protected)/quiz-active/QuizContent';
import ThankYouOverlay from '../../../../app/(protected)/quiz-active/ThankYouOverlay';
import ErrorState from '../../../components/Shared/ErrorState';
import { usePublicSurvey } from '../../../hooks/usePublicSurvey';
import { FM } from '../../../localization/helpers';
import PublicSurveyState from '../../../shared/enums/PublicSurveyState';
import { TestIds } from '../../../shared/testIds';
import { useTheme } from '../../../theme/hooks/useTheme';
import { layoutStyles, useDynamicFormStyles } from '../../../theme/utils/styles';
import { isValueDefined } from '../../../utils/is';

const SPACING = 8;
const PADDING = 16;

const screenStyles = StyleSheet.create({
  stateContainer: { flex: 1, padding: PADDING, justifyContent: 'center', alignItems: 'center' },
  stateTitle: { fontSize: 20, fontWeight: '600', textAlign: 'center', marginBottom: SPACING },
  stateMessage: { fontSize: 16, textAlign: 'center' },
  loadingText: { marginTop: SPACING, fontSize: 16 },
});

interface Props {
  externalId: string;
}

const PublicSurveyScreen = ({ externalId }: Props): React.ReactElement => {
  const { theme } = useTheme();
  const colors = theme.colors;
  const styles = useDynamicFormStyles();
  const { state, quizForm } = usePublicSurvey(externalId);

  const colorStyles = useMemo(
    () => ({
      container: { backgroundColor: String(colors.background) },
      title: { color: String(colors.text) },
      message: { color: String(colors.textSecondary) },
    }),
    [colors.background, colors.text, colors.textSecondary],
  );

  const hasFormWithQuestions = isValueDefined(quizForm.form) && quizForm.form.questions.length > 0;
  const shouldShowForm = state === PublicSurveyState.Ready && hasFormWithQuestions;

  return (
    <View
      style={[layoutStyles.container, colorStyles.container]}
      testID={TestIds.PUBLIC_SURVEY_PAGE}
    >
      {state === PublicSurveyState.Loading ? (
        <View style={screenStyles.stateContainer} testID={TestIds.PUBLIC_SURVEY_LOADING}>
          <ActivityIndicator />
          <Text style={[screenStyles.loadingText, colorStyles.message]}>
            {FM('publicSurvey.loading')}
          </Text>
        </View>
      ) : null}

      {state === PublicSurveyState.NotFound ? (
        <View style={screenStyles.stateContainer} testID={TestIds.PUBLIC_SURVEY_UNAVAILABLE}>
          <Text style={[screenStyles.stateTitle, colorStyles.title]}>
            {FM('publicSurvey.unavailableTitle')}
          </Text>
          <Text style={[screenStyles.stateMessage, colorStyles.message]}>
            {FM('publicSurvey.unavailableMessage')}
          </Text>
        </View>
      ) : null}

      {state === PublicSurveyState.Error ? (
        <ErrorState
          message={FM('publicSurvey.errorMessage')}
          testID={TestIds.PUBLIC_SURVEY_ERROR}
          onRetry={() => {
            quizForm.resetQuiz();
          }}
        />
      ) : null}

      {shouldShowForm && quizForm.form ? (
        <QuizContent
          currentPage={quizForm.currentPage}
          currentQuestions={quizForm.currentQuestions}
          errors={quizForm.errors}
          form={quizForm.form}
          handleBack={quizForm.handleBack}
          handleNext={quizForm.handleNext}
          pageOpacity={quizForm.pageOpacity}
          scrollRef={quizForm.scrollRef}
          shouldSkip={quizForm.shouldSkip}
          styles={styles}
          submitting={quizForm.submitting}
          totalPages={quizForm.totalPages}
          updateAnswer={quizForm.updateAnswer}
        />
      ) : null}

      <ThankYouOverlay
        backgroundColor={String(colors.background)}
        textColor={String(colors.text)}
        thankYouText={FM('publicSurvey.submitThankYou')}
        visible={quizForm.showThankYou}
        onAnimationComplete={quizForm.onThankYouComplete}
      />
    </View>
  );
};

export default PublicSurveyScreen;
