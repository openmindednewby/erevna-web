import { BFF_API_BASE } from '../../../../server/bffRoutes';
import { isValueDefined } from '../../../../utils/is';
import { get } from '../../../http/utils/methods';
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZES, mapRawContentToDto } from '../types';


import type {
  ContentCategory,
  ContentDto,
  FileInfo,
  RawContentDto,
  UploadContentResponse,
} from '../types';

const CONTENT_API_BASE = BFF_API_BASE.content;

const BYTES_PER_KB = 1024;
const BYTES_PER_MB = BYTES_PER_KB * BYTES_PER_KB;

const HTTP_SUCCESS_MIN = 200;
const HTTP_SUCCESS_MAX = 300;

export const PROGRESS_COMPLETE = 100;

export function validateFile(
  file: FileInfo,
  category: ContentCategory,
): { valid: boolean; error?: string } {
  const maxSize = MAX_FILE_SIZES[category];
  if (file.size > maxSize) {
    const maxSizeMB = Math.round(maxSize / BYTES_PER_MB);
    return {
      valid: false,
      error: `File size exceeds maximum allowed (${maxSizeMB}MB)`,
    };
  }

  const allowedTypes = ALLOWED_MIME_TYPES[category];
  if (!allowedTypes.includes(file.type))
    return {
      valid: false,
      error: `File type "${file.type}" is not allowed for ${category}`,
    };


  return { valid: true };
}

interface ProxyUploadArgs {
  file: FileInfo;
  category: ContentCategory;
  isPublic: boolean;
  onProgress?: (progress: number) => void;
  signal?: AbortSignal;
}

export async function proxyUploadContent(args: ProxyUploadArgs): Promise<UploadContentResponse> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    setupProxyXhrEventListeners(xhr, args.onProgress, resolve, reject);
    if (isValueDefined(args.signal))
      args.signal.addEventListener('abort', () => xhr.abort());

    xhr.open('POST', `${CONTENT_API_BASE}/api/v1/content/upload`);
    xhr.withCredentials = true;
    xhr.setRequestHeader('X-BFF-Csrf', '1');
    fetchAndSendMultipart(xhr, args, reject);
  });
}

export async function fetchContent(contentId: string): Promise<ContentDto> {
  const raw = await get<undefined, RawContentDto>(`/api/v1/content/${contentId}`, undefined, {
    withToken: false,
    withCredentials: true,
    baseURL: CONTENT_API_BASE,
  });
  return mapRawContentToDto(raw);
}

function setupProxyXhrEventListeners(
  xhr: XMLHttpRequest,
  onProgress: ((progress: number) => void) | undefined,
  resolve: (value: UploadContentResponse) => void,
  reject: (error: Error) => void,
): void {
  xhr.upload.addEventListener('progress', (event) => {
    if (event.lengthComputable && isValueDefined(onProgress)) {
      const progress = Math.round((event.loaded / event.total) * PROGRESS_COMPLETE);
      onProgress(progress);
    }
  });
  xhr.addEventListener('load', () => {
    const isSuccess = xhr.status >= HTTP_SUCCESS_MIN && xhr.status < HTTP_SUCCESS_MAX;
    if (!isSuccess) {
      reject(new Error(`Upload failed with status ${xhr.status}`));
      return;
    }
    parseUploadResponse(xhr.responseText, resolve, reject);
  });
  xhr.addEventListener('error', () => reject(new Error('Upload failed due to network error')));
  xhr.addEventListener('abort', () => reject(new Error('Upload was cancelled')));
}

function parseUploadResponse(
  responseText: string,
  resolve: (value: UploadContentResponse) => void,
  reject: (error: Error) => void,
): void {
  try {
    const parsed: unknown = JSON.parse(responseText);
    if (!isUploadContentResponse(parsed)) {
      reject(new Error('Upload response shape was invalid'));
      return;
    }
    resolve(parsed);
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error));
    reject(err);
  }
}

function isUploadContentResponse(value: unknown): value is UploadContentResponse {
  if (!isPlainObject(value)) return false;
  return typeof value.contentId === 'string' && typeof value.status === 'string';
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && isValueDefined(value) && !Array.isArray(value);
}

function fetchAndSendMultipart(
  xhr: XMLHttpRequest,
  args: ProxyUploadArgs,
  reject: (error: Error) => void,
): void {
  fetch(args.file.uri)
    .then(async (response) => {
      if (!response.ok) throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`);
      return response.blob();
    })
    .then((blob) => {
      if (blob.size === 0) throw new Error('File blob is empty');
      const form = new FormData();
      form.append('File', blob, args.file.name);
      form.append('Category', args.category);
      form.append('IsPublic', String(args.isPublic));
      xhr.send(form);
    })
    .catch((error: unknown) => {
      console.error('Upload error:', error);
      const err = error instanceof Error ? error : new Error(String(error));
      reject(err);
    });
}
