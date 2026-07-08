/**
 * Tests for the file-upload pure helpers and error-code mapping.
 */
import { extractFileErrorCode, FileUploadErrorCode, messageKeyForCode } from './FileUploadErrorCode';
import {
  asFileReferences,
  bytesToMb,
  DEFAULT_MAX_FILES,
  DEFAULT_MAX_SIZE_BYTES,
  fileUploadValidate,
  formatFileNames,
  isAtFileLimit,
  mbToBytes,
  resolveAllowedContentTypes,
  resolveMaxFiles,
  resolveMaxSizeBytes,
  toggleContentType,
  validateFileClientSide,
} from './fileUploadHelpers';

import type { ValidationMessages } from './validation';
import type { FileReference, Question } from '../interfaces';

const MESSAGES: ValidationMessages = {
  required: 'required', minLength: 'minLength', maxLength: 'maxLength',
  pattern: 'pattern', min: 'min', max: 'max', minSelections: 'minSel', maxSelections: 'maxSel',
};

const REF: FileReference = { objectKey: 'k1', fileName: 'a.pdf', contentType: 'application/pdf', sizeBytes: 1024 };

describe('fileUploadHelpers - config resolution', () => {
  it('falls back to server defaults when config is absent', () => {
    expect(resolveMaxFiles(undefined)).toBe(DEFAULT_MAX_FILES);
    expect(resolveMaxSizeBytes(undefined)).toBe(DEFAULT_MAX_SIZE_BYTES);
    expect(resolveAllowedContentTypes(undefined)).toContain('application/pdf');
  });

  it('uses configured values when present', () => {
    expect(resolveMaxFiles({ maxFiles: 3 })).toBe(3);
    expect(resolveMaxSizeBytes({ maxSizeBytes: 500 })).toBe(500);
    expect(resolveAllowedContentTypes({ allowedContentTypes: ['image/png'] })).toEqual(['image/png']);
  });

  it('ignores non-positive overrides', () => {
    expect(resolveMaxFiles({ maxFiles: 0 })).toBe(DEFAULT_MAX_FILES);
    expect(resolveMaxSizeBytes({ maxSizeBytes: 0 })).toBe(DEFAULT_MAX_SIZE_BYTES);
    expect(resolveAllowedContentTypes({ allowedContentTypes: [] })).toContain('image/jpeg');
  });
});

describe('fileUploadHelpers - asFileReferences', () => {
  it('returns file references from a matching array', () => {
    expect(asFileReferences([REF])).toEqual([REF]);
  });

  it('ignores non-file shapes', () => {
    expect(asFileReferences('text')).toEqual([]);
    expect(asFileReferences(['a', 'b'])).toEqual([]);
    expect(asFileReferences(undefined)).toEqual([]);
  });
});

describe('fileUploadHelpers - client validation', () => {
  it('rejects a disallowed content type', () => {
    const result = validateFileClientSide({ name: 'x.exe', contentType: 'application/x-msdownload', sizeBytes: 10 }, undefined);
    expect(result).toBe(FileUploadErrorCode.FileType);
  });

  it('rejects a file over the size cap', () => {
    const result = validateFileClientSide({ name: 'big.pdf', contentType: 'application/pdf', sizeBytes: DEFAULT_MAX_SIZE_BYTES + 1 }, undefined);
    expect(result).toBe(FileUploadErrorCode.FileTooLarge);
  });

  it('accepts an allowed, in-size file (case-insensitive type match)', () => {
    const result = validateFileClientSide({ name: 'p.pdf', contentType: 'APPLICATION/PDF', sizeBytes: 100 }, undefined);
    expect(result).toBeUndefined();
  });

  it('reports the file limit', () => {
    expect(isAtFileLimit([REF], { maxFiles: 1 })).toBe(true);
    expect(isAtFileLimit([], { maxFiles: 1 })).toBe(false);
  });
});

describe('fileUploadHelpers - conversions and formatting', () => {
  it('round-trips MB and bytes', () => {
    expect(mbToBytes(10)).toBe(DEFAULT_MAX_SIZE_BYTES);
    expect(bytesToMb(DEFAULT_MAX_SIZE_BYTES)).toBe(10);
  });

  it('toggles a content type in and out of the list', () => {
    expect(toggleContentType(['image/png'], 'image/jpeg')).toEqual(['image/png', 'image/jpeg']);
    expect(toggleContentType(['image/png', 'image/jpeg'], 'image/png')).toEqual(['image/jpeg']);
  });

  it('joins file names for CSV export', () => {
    expect(formatFileNames([REF, { ...REF, fileName: 'b.png' }])).toBe('a.pdf;b.png');
  });
});

describe('fileUploadHelpers - fileUploadValidate', () => {
  function question(required: boolean): Question {
    return { id: 'q', name: 'N', type: 'file-upload' as Question['type'], page: 1, order: 1, isRequired: required };
  }

  it('requires at least one file when required', () => {
    expect(fileUploadValidate([], question(true), MESSAGES)).toBe('required');
    expect(fileUploadValidate([REF], question(true), MESSAGES)).toBeUndefined();
  });

  it('is satisfied when optional', () => {
    expect(fileUploadValidate(undefined, question(false), MESSAGES)).toBeUndefined();
  });
});

describe('FileUploadErrorCode - extraction and message keys', () => {
  it('maps HTTP status codes', () => {
    expect(extractFileErrorCode({ response: { status: 409 } })).toBe(FileUploadErrorCode.SurveyClosed);
    expect(extractFileErrorCode({ response: { status: 404 } })).toBe(FileUploadErrorCode.NotFound);
  });

  it('extracts a body error code', () => {
    expect(extractFileErrorCode({ response: { status: 400, data: { code: 'FILE_TOO_LARGE' } } })).toBe(FileUploadErrorCode.FileTooLarge);
    expect(extractFileErrorCode({ response: { status: 400, data: 'FILE_TYPE not allowed' } })).toBe(FileUploadErrorCode.FileType);
  });

  it('falls back to Unknown for unrecognized errors', () => {
    expect(extractFileErrorCode(new Error('boom'))).toBe(FileUploadErrorCode.Unknown);
    expect(extractFileErrorCode(undefined)).toBe(FileUploadErrorCode.Unknown);
  });

  it('maps every code to a message key', () => {
    expect(messageKeyForCode(FileUploadErrorCode.FileType)).toBe('quizActive.fileUpload.error.fileType');
    expect(messageKeyForCode(FileUploadErrorCode.Unknown)).toBe('quizActive.fileUpload.error.unknown');
  });
});
