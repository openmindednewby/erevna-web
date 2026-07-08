/**
 * File-upload error codes returned by the public upload endpoint (400 responses),
 * plus helpers to extract a code from an unknown thrown error and map it to an
 * i18n message key. Kept isolated so the enum lives in its own file.
 */
import { isValueDefined } from '../../../utils/is';

const HTTP_CONFLICT = 409;
const HTTP_NOT_FOUND = 404;

export const enum FileUploadErrorCode {
  FileType = 'FILE_TYPE',
  FileTooLarge = 'FILE_TOO_LARGE',
  FileTooMany = 'FILE_TOO_MANY',
  FileReference = 'FILE_REFERENCE',
  SurveyClosed = 'SURVEY_CLOSED',
  NotFound = 'NOT_FOUND',
  Unknown = 'UNKNOWN',
}

interface ErrorWithResponse {
  response?: { status?: number; data?: unknown };
}

function asErrorWithResponse(error: unknown): ErrorWithResponse | undefined {
  if (typeof error !== 'object') return undefined;
  if (!isValueDefined(error)) return undefined;
  return error;
}

/** Serialize the response body defensively so we can substring-match error codes. */
function stringifyBody(data: unknown): string {
  if (typeof data === 'string') return data;
  try {
    return JSON.stringify(data ?? '');
  } catch {
    return '';
  }
}

/** Maps an unknown thrown upload error to a known file-upload error code. */
export function extractFileErrorCode(error: unknown): FileUploadErrorCode {
  const knownBodyCodes: readonly FileUploadErrorCode[] = [
    FileUploadErrorCode.FileType,
    FileUploadErrorCode.FileTooLarge,
    FileUploadErrorCode.FileTooMany,
    FileUploadErrorCode.FileReference,
  ];
  const withResponse = asErrorWithResponse(error);
  const status = withResponse?.response?.status;
  if (status === HTTP_CONFLICT) return FileUploadErrorCode.SurveyClosed;
  if (status === HTTP_NOT_FOUND) return FileUploadErrorCode.NotFound;

  const body = stringifyBody(withResponse?.response?.data);
  const matched = knownBodyCodes.find((code) => body.includes(code));
  return isValueDefined(matched) ? matched : FileUploadErrorCode.Unknown;
}

/** Maps a file-upload error code to its i18n message key (under quizActive.fileUpload.error). */
export function messageKeyForCode(code: FileUploadErrorCode): string {
  switch (code) {
    case FileUploadErrorCode.FileType:
      return 'quizActive.fileUpload.error.fileType';
    case FileUploadErrorCode.FileTooLarge:
      return 'quizActive.fileUpload.error.fileTooLarge';
    case FileUploadErrorCode.FileTooMany:
      return 'quizActive.fileUpload.error.fileTooMany';
    case FileUploadErrorCode.FileReference:
      return 'quizActive.fileUpload.error.fileReference';
    case FileUploadErrorCode.SurveyClosed:
      return 'quizActive.fileUpload.error.surveyClosed';
    case FileUploadErrorCode.NotFound:
      return 'quizActive.fileUpload.error.notFound';
    case FileUploadErrorCode.Unknown:
      return 'quizActive.fileUpload.error.unknown';
    default:
      throw new Error(`Unhandled file-upload error code: ${String(code)}`);
  }
}
