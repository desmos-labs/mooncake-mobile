import React from 'react';
import {followingState} from '@recoil/following';
import useCheckAndUpdateGrants from 'hooks/authGrants/useCheckAndUpdateGrants';
import {act, renderHook} from '@testing-library/react-native';
import useFollowOrUnfollow from 'services/axios/requests/CentralizedBroadcastTx/useFollowOrUnfollow/index';
import {RecoilRoot} from 'recoil';
import {useGetAuthzGrants} from 'services/graphql/queries/GetAuthGrants';
import {encodeAndBroadcastTx} from 'services/axios/requests/CentralizedBroadcastTx';
import {GrantEnums} from 'lib/desmos/msgtypes';
import {MsgCreateRelationship} from '@desmoslabs/desmjs-types/desmos/relationships/v1/msgs';
import Long from 'long';
import EnvConfig from 'config/EnvConfig';

const mockActiveAddress = 'i-am-an-address';

jest.mock('hooks/useActiveAccount', () =>
  jest.fn(() => ({activeAddress: mockActiveAddress})),
);

jest.mock('hooks/authGrants/useCheckAndUpdateGrants');

jest.mock('react-native-toast-notifications');

const mockEncodeToAmino = 'mockAminoEncodedMessage';
jest.mock('@desmoslabs/desmjs', () => ({
  DesmosClient: {
    connect: () => ({
      encodeToAmino: () => mockEncodeToAmino,
      disconnect: jest.fn(),
    }),
  },
}));

jest.mock('@apollo/client', () => ({
  gql: () => jest.fn(),
}));

jest.mock('services/graphql/queries/GetAuthGrants', () => ({
  useGetAuthzGrants: jest.fn(),
}));

jest.mock('services/axios/requests/CentralizedBroadcastTx');

describe('hook: useFollowOrUnfollow', () => {
  it('follows a user', async () => {
    const mockCounterParty = 'mockCounterParty';

    const mockCheckAndUpdateGrants = jest.fn(() => ({success: true}));
    (useCheckAndUpdateGrants as jest.Mock).mockImplementation(() => ({
      checkAndUpdateGrants: mockCheckAndUpdateGrants,
    }));

    const initializeState = ({set}: any) => {
      // simulate a case where the user is not following the addrToFollow
      set(followingState, []);
    };

    (useGetAuthzGrants as jest.Mock).mockReturnValue({
      getAuthzGrants: () => ({
        has_fee_grant: false,
        grants: [],
      }),
    });

    (encodeAndBroadcastTx as jest.Mock).mockReturnValue({tx_hash: '123'});

    const {result} = renderHook(() => useFollowOrUnfollow(), {
      wrapper: props => (
        <RecoilRoot initializeState={initializeState}>
          {props.children}
        </RecoilRoot>
      ),
    });

    await act(async () => {
      await result.current.followOrUnfollowUser({
        addrToFollow: mockCounterParty,
      });
    });

    const mockMsgs = [
      {
        typeUrl: GrantEnums.MsgCreateRelationship,
        value: MsgCreateRelationship.fromPartial({
          signer: mockActiveAddress,
          counterparty: mockCounterParty,
          subspaceId: Long.fromNumber(EnvConfig.APP_SUBSPACE_ID),
        }),
      },
    ];

    expect(encodeAndBroadcastTx).toHaveBeenCalledWith({msgs: mockMsgs});
  });

  it('unfollows a user', async () => {
    const mockCounterParty = 'mockCounterParty';

    const mockCheckAndUpdateGrants = jest.fn(() => ({success: true}));
    (useCheckAndUpdateGrants as jest.Mock).mockImplementation(() => ({
      checkAndUpdateGrants: mockCheckAndUpdateGrants,
    }));

    const initializeState = ({set}: any) => {
      // simulate a case where the user is already following the addrToFollow
      set(followingState, [{address: mockCounterParty}]);
    };

    (useGetAuthzGrants as jest.Mock).mockReturnValue({
      getAuthzGrants: () => ({
        has_fee_grant: false,
        grants: [],
      }),
    });

    (encodeAndBroadcastTx as jest.Mock).mockReturnValue({tx_hash: '123'});

    const {result} = renderHook(() => useFollowOrUnfollow(), {
      wrapper: props => (
        <RecoilRoot initializeState={initializeState}>
          {props.children}
        </RecoilRoot>
      ),
    });

    await act(async () => {
      await result.current.followOrUnfollowUser({
        addrToFollow: mockCounterParty,
      });
    });

    const mockMsgs = [
      {
        typeUrl: GrantEnums.MsgDeleteRelationship,
        value: MsgCreateRelationship.fromPartial({
          signer: mockActiveAddress,
          counterparty: mockCounterParty,
          subspaceId: Long.fromNumber(EnvConfig.APP_SUBSPACE_ID),
        }),
      },
    ];

    expect(encodeAndBroadcastTx).toHaveBeenCalledWith({msgs: mockMsgs});
  });
});
