import {act, renderHook} from '@testing-library/react-native';
import useGetActiveGrants from 'services/axios/requests/GetActiveGrants/useGetActiveGrants';
import GetActiveGrants from 'services/axios/requests/GetActiveGrants/index';
import {useMMKVStorage} from 'lib/MMKVStorage';
import {GrantEnums} from 'lib/desmos/msgtypes';

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

  it('checkGrants: Checks single grants', async () => {
    (useMMKVStorage as jest.Mock).mockReturnValue(['i-am-an-address']);

    const {result} = renderHook(() => useGetActiveGrants());

    let response: any;
    await act(async () => {
      response = await result.current.checkGrants([GrantEnums.MsgCreatePost]);
    });

    expect(response[GrantEnums.MsgCreatePost]).toBeTruthy();
  });

  it('checkGrants: Checks multiple grants', async () => {
    const GRANTS_TO_CHECK = [
      GrantEnums.MsgCreatePost,
      GrantEnums.MsgAddReaction,
      GrantEnums.MsgCreateReport,
    ];

    (GetActiveGrants as jest.Mock).mockReturnValue({
      ...mockedResponse,
      grants: GRANTS_TO_CHECK,
    });
    (useMMKVStorage as jest.Mock).mockReturnValue(['i-am-an-address']);

    const {result} = renderHook(() => useGetActiveGrants());

    let response: any;
    await act(async () => {
      response = await result.current.checkGrants(GRANTS_TO_CHECK);
    });

    expect(response).toEqual({
      [GrantEnums.MsgCreatePost]: true,
      [GrantEnums.MsgAddReaction]: true,
      [GrantEnums.MsgCreateReport]: true,
    });
  });

  it('checkGrants: does not call API if activeAddr is not in MMKV', async () => {
    (useMMKVStorage as jest.Mock).mockReturnValue(['']);

    const {result} = renderHook(() => useGetActiveGrants());

    act(() => {
      result.current.checkGrants([]);
    });

    expect(GetActiveGrants).toHaveBeenCalledTimes(0);
  });
});
