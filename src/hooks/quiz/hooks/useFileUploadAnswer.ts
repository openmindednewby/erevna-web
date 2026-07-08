/**
 * Orchestrates the file-upload answer for a single question: picking a file,
 * client-side pre-validation, uploading via the public endpoint, and reflecting
 * the returned reference into the answer. Keeps {@link FileUploadQuestion} thin.
 */
import { useCallback, useState } from 'react';

import * as ExpoDocumentPicker from 'expo-document-picker';

import { extractFileErrorCode, FileUploadErrorCode, messageKeyForCode } from '../../../components/DynamicForm/questionTypes/FileUploadErrorCode';
import {
  asFileReferences,
  isAtFileLimit,
  resolveAllowedContentTypes,
  validateFileClientSide,
  type PickedFile,
} from '../../../components/DynamicForm/questionTypes/fileUploadHelpers';
import { usePublicFileUpload } from '../../../server/customHooks/usePublicFileUpload';
import { isValueDefined } from '../../../utils/is';

import type { Answer, FileReference, Question, QuestionConfig } from '../../../components/DynamicForm';
import type { UploadFileParams } from '../../../server/customHooks/usePublicFileUpload';

interface PickedAsset extends PickedFile {
  uri: string;
}

interface FileUploadUiState {
  isUploading: boolean;
  progress: number;
  errorKey?: string;
  pendingName?: string;
}

interface UseFileUploadAnswerResult {
  files: FileReference[];
  state: FileUploadUiState;
  pickAndUpload: () => Promise<void>;
  removeFile: (objectKey: string) => void;
}

interface UploadContext {
  surveyExternalId?: string;
  config?: QuestionConfig;
  questionId: string;
  current: FileReference[];
  uploadFile: (params: UploadFileParams) => Promise<FileReference>;
  setState: (state: FileUploadUiState) => void;
  onUploaded: (files: FileReference[]) => void;
}

const IDLE_STATE: FileUploadUiState = { isUploading: false, progress: 0 };

export function useFileUploadAnswer(
  surveyExternalId: string | undefined,
  question: Question,
  value: Answer,
  updateAnswer: (value: Answer) => void,
): UseFileUploadAnswerResult {
  const { uploadFile } = usePublicFileUpload(surveyExternalId ?? '');
  const [state, setState] = useState<FileUploadUiState>(IDLE_STATE);
  const files = asFileReferences(value);

  const removeFile = useCallback(
    (objectKey: string): void => updateAnswer(asFileReferences(value).filter((f) => f.objectKey !== objectKey)),
    [value, updateAnswer],
  );

  const pickAndUpload = useCallback(
    async (): Promise<void> =>
      performUpload({
        surveyExternalId,
        config: question.config,
        questionId: question.id,
        current: asFileReferences(value),
        uploadFile,
        setState,
        onUploaded: updateAnswer,
      }),
    [surveyExternalId, question.config, question.id, value, uploadFile, updateAnswer],
  );

  return { files, state, pickAndUpload, removeFile };
}

/** Pre-upload gate: returns a localized error key when the pick must be blocked. */
function preUploadErrorKey(context: UploadContext): string | undefined {
  const hasSurvey = isValueDefined(context.surveyExternalId) && context.surveyExternalId !== '';
  if (!hasSurvey) return messageKeyForCode(FileUploadErrorCode.Unknown);
  if (isAtFileLimit(context.current, context.config)) return messageKeyForCode(FileUploadErrorCode.FileTooMany);
  return undefined;
}

async function pickSingleFile(allowed: string[]): Promise<PickedAsset | null> {
  const result = await ExpoDocumentPicker.getDocumentAsync({ type: allowed, multiple: false, copyToCacheDirectory: true });
  if (result.canceled || result.assets.length === 0) return null;
  const asset = result.assets[0];
  return {
    uri: asset.uri,
    name: asset.name,
    contentType: asset.mimeType ?? 'application/octet-stream',
    sizeBytes: asset.size ?? 0,
  };
}

async function resolveBlob(asset: PickedAsset): Promise<Blob> {
  const response = await fetch(asset.uri);
  return response.blob();
}

async function uploadAsset(context: UploadContext, asset: PickedAsset): Promise<void> {
  context.setState({ isUploading: true, progress: 0, pendingName: asset.name });
  try {
    const blob = await resolveBlob(asset);
    const reference = await context.uploadFile({
      questionId: context.questionId,
      file: blob,
      fileName: asset.name,
      onProgress: (fraction) => context.setState({ isUploading: true, progress: fraction, pendingName: asset.name }),
    });
    context.onUploaded([...context.current, reference]);
    context.setState(IDLE_STATE);
  } catch (error) {
    context.setState({ ...IDLE_STATE, errorKey: messageKeyForCode(extractFileErrorCode(error)) });
  }
}

async function performUpload(context: UploadContext): Promise<void> {
  const blockedKey = preUploadErrorKey(context);
  if (isValueDefined(blockedKey)) {
    context.setState({ ...IDLE_STATE, errorKey: blockedKey });
    return;
  }
  const asset = await pickSingleFile(resolveAllowedContentTypes(context.config));
  if (!isValueDefined(asset)) return;

  const clientError = validateFileClientSide(asset, context.config);
  if (isValueDefined(clientError)) {
    context.setState({ ...IDLE_STATE, errorKey: messageKeyForCode(clientError) });
    return;
  }
  await uploadAsset(context, asset);
}
