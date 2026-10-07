import { isValueDefined } from '../../../utils/is';

import type ContentCategory from '../../../shared/enums/ContentCategory';
import type ContentStatus from '../../../shared/enums/ContentStatus';

export { default as ContentCategory } from '../../../shared/enums/ContentCategory';
export { default as ContentStatus } from '../../../shared/enums/ContentStatus';

export interface RawContentDto {
  externalId: string;
  fileName: string;
  originalFileName: string;
  contentType: string;
  category: ContentCategory;
  status: ContentStatus;
  fileSizeBytes: number;
  isPublic: boolean;
  metadataJson?: string;
  createdDate: string;
  lastUpdatedDate?: string;
}

export interface ContentDto {
  id: string;
  fileName: string;
  contentType: string;
  category: ContentCategory;
  status: ContentStatus;
  url?: string;
  thumbnailUrl?: string;
  fileSizeBytes?: number;
  metadata?: Record<string, string | undefined>;
  createdAt?: string;
  updatedAt?: string;
}

const BYTES_PER_KB = 1024;
const BYTES_PER_MB = BYTES_PER_KB * BYTES_PER_KB;

const MAX_IMAGE_SIZE_MB = 10;

export interface UploadContentResponse {
  contentId: string;
  status: ContentStatus;
  url?: string;
}

export interface ContentUrlResponse {
  url: string;
  expiresAt: string;
}

export interface ContentListParams {
  category?: ContentCategory;
  page?: number;
  pageSize?: number;
}

export interface ContentListResponse {
  items: ContentDto[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface UploadContentOptions {
  category: ContentCategory;
  isPublic?: boolean;
  onProgress?: (progress: number) => void;
  onSuccess?: (content: ContentDto) => void;
  onError?: (error: Error) => void;
}

export interface FileInfo {
  uri: string;
  name: string;
  type: string;
  size: number;
}

export interface UploadState {
  isUploading: boolean;
  progress: number;
  error: Error | null;
  contentId: string | null;
}
const MAX_VIDEO_SIZE_MB = 500;
const MAX_DOCUMENT_SIZE_MB = 50;

function isMetadataRecord(value: unknown): value is Record<string, string | undefined> {
  return isValueDefined(value) && typeof value === 'object';
}

function parseMetadataJson(json: string | undefined): Record<string, string | undefined> | undefined {
  if (!isValueDefined(json) || json === '') return undefined;
  const parsed: unknown = JSON.parse(json);
  return isMetadataRecord(parsed) ? parsed : undefined;
}

export function mapRawContentToDto(raw: RawContentDto): ContentDto {
  return {
    id: raw.externalId,
    fileName: raw.originalFileName !== '' ? raw.originalFileName : raw.fileName,
    contentType: raw.contentType,
    category: raw.category,
    status: raw.status,
    fileSizeBytes: raw.fileSizeBytes,
    createdAt: raw.createdDate,
    updatedAt: raw.lastUpdatedDate,
    metadata: parseMetadataJson(raw.metadataJson),
  };
}

export const MAX_FILE_SIZES: Record<ContentCategory, number> = {
  Image: MAX_IMAGE_SIZE_MB * BYTES_PER_MB,
  Video: MAX_VIDEO_SIZE_MB * BYTES_PER_MB,
  Document: MAX_DOCUMENT_SIZE_MB * BYTES_PER_MB,
};

export const ALLOWED_MIME_TYPES: Record<ContentCategory, string[]> = {
  Image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  Video: ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm'],
  Document: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
};
