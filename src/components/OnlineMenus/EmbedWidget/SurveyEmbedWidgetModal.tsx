import React from 'react';


import EmbedWidgetModal from './EmbedWidgetModal';
import { SURVEY_EMBED_KIND } from './utils/embedKind';
import { TestIds } from '../../../shared/testIds';

interface Props {
  visible: boolean;
  surveyName: string;
  publicUrl: string;
  surveyId: string;
  onClose: () => void;
}

/**
 * Survey embed modal — a thin wrapper around the shared {@link EmbedWidgetModal} that
 * passes the survey embed kind, title key and testID. Reuses the entire menu embed UI
 * (iframe / JS tabs, width/height/theme/accent config, copy-to-clipboard).
 */
const SurveyEmbedWidgetModal = ({ visible, surveyName, publicUrl, surveyId, onClose }: Props): React.ReactElement => (
  <EmbedWidgetModal
    kind={SURVEY_EMBED_KIND}
    menuId={surveyId}
    menuName={surveyName}
    modalTestID={TestIds.SURVEY_EMBED_WIDGET_MODAL}
    publicUrl={publicUrl}
    titleKey="quizTemplates.embedWidget.modalTitle"
    visible={visible}
    onClose={onClose}
  />
);

export default SurveyEmbedWidgetModal;
