import * as ExpoDocumentPicker from 'expo-document-picker';

import { act, renderHook } from '@testing-library/react-native';


import { useFileUploadAnswer } from './useFileUploadAnswer';

import type { Question } from '../../../components/DynamicForm';

const mockUploadFile = jest.fn();

jest.mock('expo-document-picker', () => ({ getDocumentAsync: jest.fn() }));
jest.mock('../../../server/customHooks/usePublicFileUpload', () => ({
  usePublicFileUpload: () => ({ uploadFile: mockUploadFile }),
}));

const OCTET_STREAM = 'application/octet-stream';
const FILE_SIZE_BYTES = 10;

function createQuestion(): Question {
  return { id: 'q1', config: { allowedContentTypes: [OCTET_STREAM] } } as unknown as Question;
}

describe('useFileUploadAnswer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn().mockResolvedValue({ blob: async () => new Blob(['x']) }) as unknown as typeof fetch;
    mockUploadFile.mockResolvedValue({ objectKey: 'k', fileName: 'data.bin', contentType: OCTET_STREAM, sizeBytes: FILE_SIZE_BYTES });
  });

  it('with an empty picked mime type, falls back to octet-stream and uploads', async () => {
    jest.mocked(ExpoDocumentPicker.getDocumentAsync).mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'blob:x', name: 'data.bin', mimeType: '', size: FILE_SIZE_BYTES, lastModified: 0 }],
    } as unknown as ExpoDocumentPicker.DocumentPickerResult);
    const { result } = renderHook(() => useFileUploadAnswer('survey-1', createQuestion(), [], jest.fn()));

    await act(async () => { await result.current.pickAndUpload(); });

    expect(mockUploadFile).toHaveBeenCalledTimes(1);
    expect(result.current.state.errorKey).toBeUndefined();
  });
});
