import axiosInstance from 'services/axios';
import GetNonce from './index';

jest.mock('services/axios', () => ({
  get: jest.fn(async () => ({
    data: {
      nonce: 'mock-nonce',
    },
  })),
}));

describe('services-axios: GetNonce', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls get with correct url and address', async () => {
    const mockAddress = 'mock-address';

    const result = await GetNonce(mockAddress);

    expect(axiosInstance.get).toHaveBeenCalledWith(`/nonce/${mockAddress}`);

    expect(result.isOk()).toBe(true);
    expect(result.unwrapOr(undefined)).toBe('mock-nonce');
  });
});
