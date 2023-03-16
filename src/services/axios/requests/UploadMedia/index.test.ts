import { ok } from 'neverthrow';
import axiosInstance from 'services/axios';
import { UploadMedia } from 'services/axios/requests/UploadMedia';

const MOCKED_DATA = ok({
  url: 'i-am-an-url',
});

const mockResponse = {
  status: 200,
  data: {
    cid: 'i-am-a-cid',
    url: 'i-am-an-url',
  },
};

jest.mock('services/axios/index');

describe('services: axios/UploadMedia', () => {
  it('uploads images correctly', async () => {
    (axiosInstance.post as jest.Mock).mockResolvedValueOnce(mockResponse);

    const response = await UploadMedia({
      mediaFile: { uri: '123', type: '123', fileName: '123' },
    });

    expect(response).toEqual(MOCKED_DATA);
  });
});
