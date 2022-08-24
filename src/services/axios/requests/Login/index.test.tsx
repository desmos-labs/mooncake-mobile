import {act, renderHook, waitFor} from '@testing-library/react-native';
import useLogin from 'services/axios/requests/Login/useLogin';
import GetNonce from 'services/axios/requests/GetNonce';
import useUnlockWallet from 'hooks/useUnlockWallet';
import {generateLoginData} from 'services/axios/requests/Login/utils';
import {updateAuthToken} from 'services/axios';
import Login from './index';

const mockedNavigate = jest.fn();

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: mockedNavigate,
    }),
  };
});

jest.mock('./utils', () => {
  return {
    generateLoginData: jest.fn(),
  };
});

jest.mock('../GetNonce');

jest.mock('./index');

jest.mock('hooks/useUnlockWallet', () => ({
  ...jest.requireActual('hooks/useUnlockWallet'),
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('services/axios', () => {
  return {
    updateAuthToken: jest.fn(),
  };
});

const DUMMY_TOKEN = 'i-am-a-token';

const DUMMY_ADDRESS = 'i-am-an-address';

const DUMMY_NONCE = 'i-am-a-nonce';

jest.mock('lib/SecureStorage', () => ({
  getAccounts: async () => [{address: DUMMY_ADDRESS}],
}));

describe('services/axios: useLogin', () => {
  beforeAll(() => {
    (GetNonce as jest.Mock).mockReturnValue({nonce: DUMMY_NONCE});
    (useUnlockWallet as jest.Mock).mockReturnValue(() => ({
      wallet: 'placeholder',
    }));
    (Login as jest.Mock).mockReturnValue({token: DUMMY_TOKEN});
    (generateLoginData as jest.Mock).mockReturnValue({
      signatureBytes: [1],
      pubkeyBytes: [1],
      signedBytes: [1],
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('logins and saves auth token to localStorage & axios config', async () => {
    const {result} = renderHook(() => useLogin());

    act(() => {
      result.current.login(DUMMY_ADDRESS);
    });

    await waitFor(() => {
      expect(updateAuthToken).toHaveBeenCalledWith(DUMMY_TOKEN);
    });
  });

  it('login terminates early if error occurs during Login call', async () => {
    (Login as jest.Mock).mockImplementation(() => {
      throw new Error('i-am-an-error');
    });

    const {result} = renderHook(() => useLogin());

    act(() => {
      result.current.login(DUMMY_ADDRESS);
    });

    await waitFor(() => {
      expect(updateAuthToken).toHaveBeenCalledTimes(0);
    });
  });
});
