import { GrantEnums } from 'lib/DesmosUtils/msgtypes';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import useCheckAndUpdateGrants from 'hooks/authGrants/useCheckAndUpdateGrants/index';
import { useMMKVStorage } from 'lib/MMKVStorage';
import ROUTES from 'navigation/routes';
import { useGetAuthzGrants } from 'services/graphql/queries/GetAuthGrants';

jest.mock('lib/MMKVStorage', () => ({
  useMMKVStorage: jest.fn(),
  MMKVKEYS: {},
}));

jest.mock('services/graphql/queries/GetAuthGrants', () => ({
  useGetAuthzGrants: jest.fn(),
}));

const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: mockNavigate,
    }),
  };
});

describe('hook: useCheckAndUpdateGrants', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('navigates to request grant screen if missing grants', async () => {
    const mockRequestedGrants = [GrantEnums.MsgCreateRelationship, GrantEnums.MsgRemoveReaction];

    (useMMKVStorage as jest.Mock).mockReturnValue(['123']);

    (useGetAuthzGrants as jest.Mock).mockReturnValue({
      getAuthzGrants: () => ({
        has_fee_grant: true,
        grants: [
          {
            msg_type: mockRequestedGrants[0],
            expiration: '1900-10-11T07:46:14.202Z',
          },
        ],
      }),
    });

    const { result } = renderHook(() => useCheckAndUpdateGrants());

    act(() => {
      result.current.checkAndUpdateGrants({
        grantsToRequest: mockRequestedGrants,
      });
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.ACTION_AUTHORIZATION, {
        grants: mockRequestedGrants,
        onApprove: expect.anything(),
        onCancel: expect.anything(),
      });
    });
  });

  it('does not navigate to request grants page if grants exist', async () => {
    const mockRequestedGrants = [GrantEnums.MsgCreateRelationship];

    (useGetAuthzGrants as jest.Mock).mockReturnValue({
      getAuthzGrants: () => ({
        has_fee_grant: true,
        grants: [
          {
            msg_type: mockRequestedGrants[0],
            expiration: '3123213-10-11T07:46:14.202Z',
          },
        ],
      }),
    });

    const { result } = renderHook(() => useCheckAndUpdateGrants());

    act(() => {
      result.current.checkAndUpdateGrants({
        grantsToRequest: mockRequestedGrants,
      });
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledTimes(0);
    });
  });
});
