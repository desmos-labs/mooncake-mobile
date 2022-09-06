import {act, renderHook} from '@testing-library/react-native';
import useGetActiveGrants from 'services/axios/requests/GetActiveGrants/useGetActiveGrants';
import GetActiveGrants from 'services/axios/requests/GetActiveGrants/index';
import {useMMKVStorage} from 'lib/MMKVStorage';

jest.mock('./index');

jest.mock('lib/MMKVStorage', () => ({
  MMKVKEYS: {
    ACTIVE_ACCOUNT_ADDR: 'mocked-value',
  },
  useMMKVStorage: jest.fn(),
}));

const mockedResponse = {
  user: 'i-am-an-address',

  has_fee_grant: true,

  grants: ['/desmos.posts.v2.MsgCreatePost'],
};

describe('services/axios: useGetActiveGrants', () => {
  beforeAll(() => {
    (GetActiveGrants as jest.Mock).mockReturnValue(mockedResponse);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getActiveGrants: returns list of grants', async () => {
    (useMMKVStorage as jest.Mock).mockReturnValue(['i-am-an-address']);

    const {result} = renderHook(() => useGetActiveGrants());

    let response;
    await act(async () => {
      response = await result.current.getActiveGrants();
    });

    expect(response).toEqual(mockedResponse);
  });

  it('getActiveGrants: does not call api if activeAddr is not in MMKV', () => {
    (useMMKVStorage as jest.Mock).mockReturnValue(['']);

    const {result} = renderHook(() => useGetActiveGrants());

    act(() => {
      result.current.getActiveGrants();
    });

    expect(GetActiveGrants).toBeCalledTimes(0);
  });
});
