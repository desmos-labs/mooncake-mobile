import axiosInstance from 'services/axios';
import GetNonce from './index';

const mockResponse = 'mock-response';

jest.mock('services/axios', () => ({
  get: jest.fn(() => ({
    data: mockResponse,
  })),
}));

describe('services-axios: GetNonce', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls get with correct url and address', async () => {
    const mockAddress = 'mock-address';

    const result = await GetNonce({ address: mockAddress });

    expect(axiosInstance.get).toHaveBeenCalledWith(`/nonce/${mockAddress}`);

    expect(result).toBe(mockResponse);
  });
});
