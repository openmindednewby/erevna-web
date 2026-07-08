import React from 'react';

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { FM } from '@/localization/helpers';

import { FileUploadItem } from './FileUploadItem';
import { useFileUploadAnswer } from '../../../../hooks/quiz/hooks/useFileUploadAnswer';
import { useTheme } from '../../../../theme/hooks/useTheme';
import { isValueDefined } from '../../../../utils/is';
import { isAtFileLimit, resolveMaxFiles } from '../../questionTypes/fileUploadHelpers';

import type { QuestionRenderProps } from '../../questionTypes/types';

const PERCENT_SCALE = 100;
const DISABLED_OPACITY = 0.5;
const ENABLED_OPACITY = 1;

const styles = StyleSheet.create({
  pickButton: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  pickText: { fontSize: 15, fontWeight: '600' },
  help: { fontSize: 12, marginTop: 6 },
  progress: { fontSize: 13, marginTop: 8 },
  errorText: { fontSize: 13, marginTop: 6 },
});

/** Respondent file-upload renderer: pick, upload, list, and remove file answers. */
export const FileUploadQuestion: React.FC<QuestionRenderProps> = ({ question, value, errorMsg, updateAnswer, surveyExternalId }) => {
  const { theme } = useTheme();
  const { colors, palette, semantic } = theme;
  const { files, state, pickAndUpload, removeFile } = useFileUploadAnswer(surveyExternalId, question, value, updateAnswer);

  const maxFiles = resolveMaxFiles(question.config);
  const pickDisabled = state.isUploading || isAtFileLimit(files, question.config);
  const progressPercent = Math.round(state.progress * PERCENT_SCALE);
  const hasFieldError = typeof errorMsg === 'string' && errorMsg !== '';

  const pickButtonStyle = [
    styles.pickButton,
    { borderColor: colors.border, backgroundColor: colors.surface, opacity: pickDisabled ? DISABLED_OPACITY : ENABLED_OPACITY },
  ];
  const pickTextStyle = [styles.pickText, { color: palette.primary['500'] }];
  const helpStyle = [styles.help, { color: colors.textSecondary }];
  const progressStyle = [styles.progress, { color: colors.textSecondary }];
  const errorStyle = [styles.errorText, { color: semantic.error['500'] }];

  const pickLabel = state.isUploading ? FM('quizActive.fileUpload.uploading') : FM('quizActive.fileUpload.pick');

  return (
    <View>
      {files.map((file, index) => (
        <FileUploadItem key={file.objectKey} file={file} index={index} onRemove={removeFile} />
      ))}

      <TouchableOpacity
        accessibilityHint={FM('quizActive.fileUpload.pickHint')}
        accessibilityLabel={FM('quizActive.fileUpload.pickLabel')}
        accessibilityRole="button"
        accessibilityState={{ disabled: pickDisabled }}
        disabled={pickDisabled}
        style={pickButtonStyle}
        testID="file-upload-pick-button"
        onPress={() => {
          pickAndUpload().catch(() => {});
        }}
      >
        <Text style={pickTextStyle}>{pickLabel}</Text>
      </TouchableOpacity>

      <Text style={helpStyle}>{FM('quizActive.fileUpload.help', String(maxFiles))}</Text>

      {state.isUploading ? (
        <Text style={progressStyle}>{FM('quizActive.fileUpload.progress', String(progressPercent))}</Text>
      ) : null}

      {isValueDefined(state.errorKey) ? <Text style={errorStyle}>{FM(state.errorKey)}</Text> : null}

      {hasFieldError ? <Text style={errorStyle}>{errorMsg}</Text> : null}
    </View>
  );
};
