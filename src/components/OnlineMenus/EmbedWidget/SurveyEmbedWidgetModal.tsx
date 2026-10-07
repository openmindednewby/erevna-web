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
