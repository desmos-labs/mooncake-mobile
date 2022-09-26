import {GrantEnums} from 'lib/desmos/msgtypes';
import {act, renderHook} from '@testing-library/react-native';
import useCheckAndUpdateGrants from 'hooks/authGrants/useCheckAndUpdateGrants/index';
import ROUTES from 'navigation/routes';
import {checkGrants} from 'hooks/authGrants/useCheckAndUpdateGrants/utils';

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

jest.mock('./utils');

describe('hooks: useCheckAndUpdateGrants', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Checks and navigates to ActionAuthorization screen to request missing grants', async () => {
    // Pretend that the user needs a MsgCreateReport grant
    const mockCheckGrants = [GrantEnums.MsgCreateReport];
    (checkGrants as jest.Mock).mockReturnValue(mockCheckGrants);

    const {result} = renderHook(() => useCheckAndUpdateGrants());

    await act(async () => {
      result.current
        .checkAndUpdateGrants({
          grantsToRequest: [GrantEnums.MsgCreateReport],
          address: '123',
        })
        .then();
    });

    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.ACTION_AUTHORIZATION, {
      grants: [GrantEnums.MsgCreateReport],
      onApprove: expect.anything(),
      onCancel: expect.anything(),
    });
  });

  it('Resolves with {success: true} if no grants are required', async () => {
    // pretend that user does not need any grants
    (checkGrants as jest.Mock).mockReturnValue([]);

    const {result} = renderHook(() => useCheckAndUpdateGrants());

    let response;
    await act(async () => {
      response = await result.current.checkAndUpdateGrants({
        grantsToRequest: [GrantEnums.MsgCreateReport],
        address: '123',
      });
    });

    expect(response).toEqual({success: true});
  });
});
