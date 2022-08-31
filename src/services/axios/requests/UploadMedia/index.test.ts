import axiosInstance from 'services/axios';
import UploadMedia from 'services/axios/requests/UploadMedia/index';

const MOCKED_DATA = {
  cid: 'i-am-a-cid',
  url: 'i-am-an-url',
};

jest.mock('services/axios/index');

describe('services: axios/UploadMedia', () => {
  it('uploads images correctly', async () => {
    (axiosInstance.post as jest.Mock).mockResolvedValueOnce({
      status: 200,
      data: MOCKED_DATA,
    });

    const response = await UploadMedia({
      fileUri: '123',
      fileType: '123',
      fileName: '123',
    });

    expect(response).toEqual(MOCKED_DATA);
  });

  it('Calls optional error handler if an error occurs', async () => {
    const onErrorMock = jest.fn();

    (axiosInstance.post as jest.Mock).mockRejectedValueOnce({
      status: 400,
      data: MOCKED_DATA,
    });

    await UploadMedia({
      fileUri: '123',
      fileType: '123',
      fileName: '123',
      onError: onErrorMock,
    });

    expect(onErrorMock).toHaveBeenCalledTimes(1);
  });
});
