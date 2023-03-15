import axiosInstance from 'services/axios';
import Login from './index';

const mockResponse = { value: 'mock-response' };

jest.mock('services/axios', () => ({
  post: jest.fn(async () => ({
    data: 'mock-response',
  })),
}));

const mockArgs = {
  address: 'mock-address',

  pubkeyBytes: 'mock-pubKeyBytes',

  signedBytes: 'mock-signedBytes',

  signatureBytes: 'mock-signatureBytes',
};

describe('services-axios: Login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('posts correct url and body', async () => {
    const result = await Login(mockArgs);

    expect(axiosInstance.post).toHaveBeenCalledWith('/login', {
      desmos_address: mockArgs.address,
      pubkey_bytes: mockArgs.pubkeyBytes,
      signed_bytes: mockArgs.signedBytes,
      signature_bytes: mockArgs.signatureBytes,
    });

    expect(result).toEqual(mockResponse);
  });
});
