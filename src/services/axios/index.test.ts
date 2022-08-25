import {getMMKV} from 'lib/MMKVStorage';
import RefreshSession from 'services/axios/requests/RefreshSession';
import {initializeAxiosInstance} from './index';

jest.mock('lib/MMKVStorage', () => ({
  getMMKV: jest.fn(),
  MMKVKEYS: {
    REST_AUTH_TOKEN: 'placeholder',
  },
}));

jest.mock('services/axios/requests/RefreshSession', () => jest.fn());

describe('services: axios', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('refreshes auth token if there is a bearer token in MMKV', async () => {
    (getMMKV as jest.Mock).mockReturnValue('im-a-bearer-token');
    await initializeAxiosInstance();
    expect(RefreshSession as jest.Mock).toHaveBeenCalledTimes(1);
  });

  it('does not refresh token if no bearer token is in MMKV', async () => {
    (getMMKV as jest.Mock).mockReturnValue(undefined);
    await initializeAxiosInstance();
    expect(RefreshSession as jest.Mock).toHaveBeenCalledTimes(0);
  });
});
