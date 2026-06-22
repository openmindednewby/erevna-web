/**
 * PublicSurveyScreen - the public, anonymous survey respondent UI.
 *
 * Reuses the exact pure fill stack (QuizContent + ThankYouOverlay via
 * useQuizForm) and renders friendly states for loading / not-available /
 * error. Lives outside the (protected) group; nothing here triggers the auth
 * gate.
 */
import React, { useCallback, useMemo } from 'react';

import { Platform, View } from 'react-native';
import type { LayoutChangeEvent } from 'react-native';

import RespondentContactFields from './RespondentContactFields';
import SurveyDraftRow from './SurveyDraftRow';
import SurveyStateMessage from './SurveyStateMessage';
import QuizContent from '../../../../app/(protected)/quiz-active/QuizContent';
import ThankYouOverlay from '../../../../app/(protected)/quiz-active/ThankYouOverlay';
import { buildSubmissionPayload } from '../../../hooks/quiz/utils/quizHelpers';
import { usePublicSurvey } from '../../../hooks/usePublicSurvey';
import { FM } from '../../../localization/helpers';
import PublicSurveyState from '../../../shared/enums/PublicSurveyState';
import { TestIds } from '../../../shared/testIds';
import { useTheme } from '../../../theme/hooks/useTheme';
import { layoutStyles, useDynamicFormStyles } from '../../../theme/utils/styles';
import { isValueDefined } from '../../../utils/is';
import { logger } from '../../../utils/logger';

const SURVEY_RESIZE_MESSAGE = 'survey-widget-resize';
const WILDCARD_ORIGIN = '*';

/** Posts the current content height to the parent window for embed auto-resize. */
function postSurveyResize(height: number, targetOrigin: string): void {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return;
  try {
    window.parent.postMessage({ type: SURVEY_RESIZE_MESSAGE, height }, targetOrigin);
  } catch (error) {
    logger.warn('PublicSurveyScreen', 'Failed to post resize message', error);
  }
}

interface Props {
  externalId: string;
  /** When true, renders for iframe embedding and posts resize messages to the parent. */
  embedMode?: boolean;
  /** Target origin for postMessage resize (embed mode only). Defaults to wildcard. */
  targetOrigin?: string;
  /** Resume token from the `?draft=` link; prefills saved answers when present. */
  draftToken?: string;
}

const PublicSurveyScreen = ({ externalId, embedMode = false, targetOrigin = WILDCARD_ORIGIN, draftToken = '' }: Props): React.ReactElement => {
  const { theme } = useTheme();
  const colors = theme.colors;
  const styles = useDynamicFormStyles();
  const { state, quizForm, contact, draftSave } = usePublicSurvey(externalId, draftToken);

  const handleSaveDraft = useCallback(() => {
    const form = quizForm.form;
    if (!isValueDefined(form)) return;
    const payload = buildSubmissionPayload(form, { externalId });
    const email = contact.email.trim() === '' ? undefined : contact.email.trim();
    draftSave.save(payload.contents ?? { questions: [] }, email).catch(() => {});
  }, [quizForm.form, draftSave, contact.email, externalId]);

  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      if (!embedMode) return;
      postSurveyResize(Math.ceil(event.nativeEvent.layout.height), targetOrigin);
    },
    [embedMode, targetOrigin],
  );

  const containerStyle = useMemo(
    () => ({ backgroundColor: String(colors.background) }),
    [colors.background],
  );

  const hasFormWithQuestions = isValueDefined(quizForm.form) && quizForm.form.questions.length > 0;
  const shouldShowForm = state === PublicSurveyState.Ready && hasFormWithQuestions;

  return (
    <View
      style={[layoutStyles.container, containerStyle]}
      testID={embedMode ? TestIds.SURVEY_EMBED_PAGE : TestIds.PUBLIC_SURVEY_PAGE}
      onLayout={handleLayout}
    >
      <SurveyStateMessage state={state} onRetry={quizForm.resetQuiz} />

      {shouldShowForm && contact.collects ? (
        <RespondentContactFields
          email={contact.email}
          error={contact.error}
          mode={contact.mode}
          name={contact.name}
          onEmailChange={contact.setEmail}
          onNameChange={contact.setName}
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

      {shouldShowForm && !embedMode ? (
        <SurveyDraftRow isSaving={draftSave.isSaving} resumeUrl={draftSave.resumeUrl} onSave={handleSaveDraft} />
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
