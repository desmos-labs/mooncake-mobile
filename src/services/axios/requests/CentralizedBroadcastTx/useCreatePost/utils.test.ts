import UploadMedia from 'services/axios/requests/UploadMedia';
import { uploadImageForPost } from 'services/axios/requests/CentralizedBroadcastTx/useCreatePost/utils';

jest.mock('services/axios/requests/UploadMedia');

describe('utils: useCreatePost utils', () => {
  describe('uploadImageForPost', () => {
    it('uploads an image formatted for posts', async () => {
      const mockUrl = 'i-am-a-url';
      const mockMediaFile = {
        type: 'mock-type',
      };

      (UploadMedia as jest.Mock).mockResolvedValueOnce({ url: mockUrl });

      const result = await uploadImageForPost({ mediaFile: mockMediaFile });

      expect(result).toEqual({
        uri: mockUrl,
        mimeType: mockMediaFile.type,
        size: expect.anything(),
      });
    });
  });
});
