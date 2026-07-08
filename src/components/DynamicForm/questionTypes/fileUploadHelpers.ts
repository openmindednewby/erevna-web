/**
 * Pure helpers for the file-upload question type: config defaults + resolution,
 * client-side pre-validation (type + size, mirroring the server allowlist), the
 * FileReference type guard, MB<->bytes conversion for the config editor, the CSV
 * formatter, and the registry validator. No React, no i18n — trivially testable.
 */
import { FileUploadErrorCode } from './FileUploadErrorCode';
import { isValueDefined } from '../../../utils/is';

import type { ValidationMessages } from './validation';
import type { Answer, FileReference, Question, QuestionConfig } from '../interfaces';

const BYTES_PER_MB = 1048576;

/** Server-default allowlist applied when a question sets no explicit content types. */
export const DEFAULT_ALLOWED_CONTENT_TYPES: readonly string[] = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
];

/** Server-default per-file size cap (10 MB). */
export const DEFAULT_MAX_SIZE_BYTES = 10485760;

/** Server-default number of files allowed per answer. */
export const DEFAULT_MAX_FILES = 1;

/** Default config seeded when a new file-upload question is created. */
export const FILE_UPLOAD_DEFAULT_CONFIG: QuestionConfig = {
  allowedContentTypes: [...DEFAULT_ALLOWED_CONTENT_TYPES],
  maxSizeBytes: DEFAULT_MAX_SIZE_BYTES,
  maxFiles: DEFAULT_MAX_FILES,
};

/** A file picked by the respondent, before upload. */
export interface PickedFile {
  name: string;
  contentType: string;
  sizeBytes: number;
}

export function resolveAllowedContentTypes(config: QuestionConfig | null | undefined): string[] {
  const configured = config?.allowedContentTypes;
  if (Array.isArray(configured) && configured.length > 0) return configured;
  return [...DEFAULT_ALLOWED_CONTENT_TYPES];
}

export function resolveMaxSizeBytes(config: QuestionConfig | null | undefined): number {
  const configured = config?.maxSizeBytes;
  return isValueDefined(configured) && configured > 0 ? configured : DEFAULT_MAX_SIZE_BYTES;
}

export function resolveMaxFiles(config: QuestionConfig | null | undefined): number {
  const configured = config?.maxFiles;
  return isValueDefined(configured) && configured > 0 ? configured : DEFAULT_MAX_FILES;
}

function isFileReference(value: unknown): value is FileReference {
  if (typeof value !== 'object') return false;
  if (!isValueDefined(value)) return false;
  return 'objectKey' in value && 'fileName' in value && 'contentType' in value && 'sizeBytes' in value;
}

/** Narrows an answer value to the file-reference array shape (empty when it is not). */
export function asFileReferences(value: Answer | undefined): FileReference[] {
  if (!Array.isArray(value)) return [];
  return value.filter(isFileReference);
}

/** Client-side pre-check mirroring the server rules; returns a code or undefined when valid. */
export function validateFileClientSide(
  file: PickedFile,
  config: QuestionConfig | null | undefined,
): FileUploadErrorCode | undefined {
  const allowed = resolveAllowedContentTypes(config);
  const typeAllowed = allowed.some((t) => t.toLowerCase() === file.contentType.toLowerCase());
  if (!typeAllowed) return FileUploadErrorCode.FileType;
  if (file.sizeBytes > resolveMaxSizeBytes(config)) return FileUploadErrorCode.FileTooLarge;
  return undefined;
}

/** True when adding one more file would exceed the question's maxFiles. */
export function isAtFileLimit(current: FileReference[], config: QuestionConfig | null | undefined): boolean {
  return current.length >= resolveMaxFiles(config);
}

/** Editor helper: add the content type when absent, remove it when present. */
export function toggleContentType(current: string[], value: string): string[] {
  return current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
}

export function bytesToMb(bytes: number): number {
  return Math.round((bytes / BYTES_PER_MB) * 100) / 100;
}

export function mbToBytes(mb: number): number {
  return Math.round(mb * BYTES_PER_MB);
}

/** CSV/analytics rendering: semicolon-joined file names. */
export function formatFileNames(files: FileReference[]): string {
  return files.map((f) => f.fileName).join(';');
}

/** Registry validator: a required file-upload question needs at least one uploaded file. */
export function fileUploadValidate(
  answer: Answer | undefined,
  question: Question,
  messages: ValidationMessages,
): string | undefined {
  if (question.isRequired !== true) return undefined;
  return asFileReferences(answer).length > 0 ? undefined : messages.required;
}
