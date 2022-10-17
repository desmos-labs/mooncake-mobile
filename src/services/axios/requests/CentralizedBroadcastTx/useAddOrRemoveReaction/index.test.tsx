import {act, renderHook} from '@testing-library/react-native';
import useAddOrRemoveReaction from 'services/axios/requests/CentralizedBroadcastTx/useAddOrRemoveReaction/index';
import useCheckAndUpdateGrants from 'hooks/authGrants/useCheckAndUpdateGrants';
import {GrantEnums} from 'lib/desmos/msgtypes';

const mockActiveAddress = 'i-am-an-address';

jest.mock('hooks/useActiveAccount', () =>
  jest.fn(() => ({activeAddress: mockActiveAddress})),
);

jest.mock('hooks/authGrants/useCheckAndUpdateGrants', () => jest.fn());

jest.mock('./utils', () => () => ({
  manageReaction: jest.fn(),
}));

jest.mock('@apollo/client', () => ({
  useLazyQuery: () => [jest.fn(() => ({data: undefined}))],
  gql: () => jest.fn(),
}));

jest.mock('@desmoslabs/desmjs', () => ({
  DesmosClient: {
    connect: () => ({
      encodeToAmino: jest.fn(),
      disconnect: () => jest.fn(),
    }),
  },
}));

describe('hooks: useAddOrRemoveReaction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('checks for Create and Delete relationship grants', async () => {
    const mockCheckAndUpdateGrants = jest.fn(() => ({success: true}));
    (useCheckAndUpdateGrants as jest.Mock).mockImplementation(() => ({
      checkAndUpdateGrants: mockCheckAndUpdateGrants,
    }));

    const {result} = renderHook(() => useAddOrRemoveReaction());

    await act(async () => {
      await result.current.addOrRemoveReaction({postId: 1});
    });

    expect(mockCheckAndUpdateGrants).toHaveBeenCalledWith({
      grantsToRequest: [
        GrantEnums.MsgAddReaction,
        GrantEnums.MsgRemoveReaction,
      ],
      stayOnCurrentScreen: expect.anything(),
    });
  });
});
