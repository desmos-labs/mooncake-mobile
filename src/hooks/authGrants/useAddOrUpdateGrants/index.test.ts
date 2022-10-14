import {useGetAuthzGrants} from 'services/graphql/queries/GetAuthGrants';
import {act, renderHook, waitFor} from '@testing-library/react-native';
import useAddOrUpdateGrants from 'hooks/authGrants/useAddOrUpdateGrants/index';
import {
  buildGrantAllowanceEncode,
  buildGrantMsgEncodes,
} from 'hooks/authGrants/useAddOrUpdateGrants/utils';
import {MsgGrantAllowance} from 'cosmjs-types/cosmos/feegrant/v1beta1/tx';
import {Any} from '@desmoslabs/desmjs-types/google/protobuf/any';
import {
  AllowedMsgAllowance,
  BasicAllowance,
} from 'cosmjs-types/cosmos/feegrant/v1beta1/feegrant';
import {GrantEnums} from 'lib/desmos/msgtypes';
import {MsgGrant} from 'cosmjs-types/cosmos/authz/v1beta1/tx';
import {timestampFromDate} from '@desmoslabs/desmjs';
import {genericSubspaceAuthorizationToAny} from '@desmoslabs/desmjs/build/aminomessages/subspaces/authorizations';
import {GenericSubspaceAuthorization} from '@desmoslabs/desmjs-types/desmos/subspaces/v3/authz/authz';
import Long from 'long';
import EnvConfig from 'config/EnvConfig';
import {computeGasAndFees} from 'lib/desmos/fees';
import useUnlockWallet from 'hooks/useUnlockWallet';

jest.mock('lib/desmos/fees');

jest.mock('lib/EncryptionUtils', () => jest.fn());

jest.mock('@recoil/butterConfigState', () => ({
  useButterConfig: () => ({
    butterConfig: {
      desmos_address: '123',
    },
  }),
}));

jest.mock('@recoil/activeProfileState', () => ({
  profileData: '',
  loading: false,
}));

jest.mock('hooks/useActiveAccount', () =>
  jest.fn(() => ({chainAccount: jest.fn(), loading: false})),
);

jest.mock('hooks/useUnlockWallet', () => jest.fn());

const mockBroadcastMessages = jest.fn(() => true);

jest.mock(
  'hooks/broadcastTx/useBroadcastMessages',
  () => () => mockBroadcastMessages,
);

jest.mock('services/graphql/queries/GetAuthGrants', () => ({
  useGetAuthzGrants: jest.fn(),
}));

jest.mock('hooks/authGrants/useAddOrUpdateGrants/utils', () => ({
  buildGrantAllowanceEncode: jest.fn(),
  buildGrantMsgEncodes: jest.fn(),
  buildRevokeAllowanceEncode: jest.fn(),
  buildRevokeGrantMsgEncodes: jest.fn(),
}));

describe('hooks: useAddOrUpdateGrants', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('builds a fee grant allowance msg if user does not have one', () => {
    (useGetAuthzGrants as jest.Mock).mockReturnValue({
      getAuthzGrants: () => ({
        has_fee_grant: false,
        grants: [],
      }),
    });

    const {result} = renderHook(() => useAddOrUpdateGrants());

    act(() => {
      result.current.addOrUpdateGrants({grantsToRequest: []});
    });

    waitFor(() => {
      expect(buildGrantAllowanceEncode).toBeCalled();
    });
  });

  it('does not build a fee grant allowance msg if user has one', () => {
    (useGetAuthzGrants as jest.Mock).mockReturnValue({
      getAuthzGrants: () => ({
        has_fee_grant: true,
        grants: [],
      }),
    });

    const {result} = renderHook(() => useAddOrUpdateGrants());

    act(() => {
      result.current.addOrUpdateGrants({grantsToRequest: []});
    });

    waitFor(() => {
      expect(buildGrantAllowanceEncode).toHaveBeenCalledTimes(0);
    });
  });

  it('successfully builds and broadcasts a tx containing the necessary grants', async () => {
    // simulate a user who is requesting MsgCreatePost grants for the first time

    const mockGrants = [GrantEnums.MsgCreatePost];
    const mockGrantee = 'i-am-a-grantee';
    const mockGranter = 'i-am-a-granter';

    const mockGrantAllowanceEncode = {
      typeUrl: '/cosmos.feegrant.v1beta1.MsgGrantAllowance',
      value: MsgGrantAllowance.fromPartial({
        grantee: mockGrantee,
        granter: mockGranter,
        allowance: Any.fromPartial({
          typeUrl: '/cosmos.feegrant.v1beta1.AllowedMsgAllowance',
          value: AllowedMsgAllowance.encode({
            allowance: Any.fromPartial({
              typeUrl: '/cosmos.feegrant.v1beta1.BasicAllowance',
              value: BasicAllowance.encode({
                spendLimit: [],
                expiration: undefined,
              }).finish(),
            }),
            allowedMessages: mockGrants,
          }).finish(),
        }),
      }),
    };

    const mockMsgsGrantEncodes = [
      {
        typeUrl: '/cosmos.authz.v1beta1.MsgGrant',
        value: MsgGrant.fromPartial({
          grantee: mockGrantee,
          granter: mockGranter,
          grant: {
            authorization: genericSubspaceAuthorizationToAny(
              GenericSubspaceAuthorization.fromPartial({
                subspacesIds: [Long.fromNumber(EnvConfig.APP_SUBSPACE_ID)],
                msg: mockGrants[0],
              }),
            ),
            expiration: timestampFromDate(
              new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000), // 10 years expiration
            ),
          },
        }),
      },
    ];

    (useGetAuthzGrants as jest.Mock).mockReturnValue({
      getAuthzGrants: () => ({
        has_fee_grant: false,
        grants: [],
      }),
    });

    (buildGrantAllowanceEncode as jest.Mock).mockReturnValue(
      mockGrantAllowanceEncode,
    );

    (buildGrantMsgEncodes as jest.Mock).mockReturnValue(mockMsgsGrantEncodes);

    (computeGasAndFees as jest.Mock).mockReturnValue({
      fee: {low: 0, average: 0, high: 0},
    });

    (useUnlockWallet as jest.Mock).mockReturnValue((_: any) => ({
      wallet: true,
    }));

    const {result} = renderHook(() => useAddOrUpdateGrants());

    act(() => {
      result.current.addOrUpdateGrants({grantsToRequest: mockGrants});
    });

    await waitFor(() => {
      expect(mockBroadcastMessages).toHaveBeenCalledWith(
        expect.anything(), // wallet
        [mockGrantAllowanceEncode, ...mockMsgsGrantEncodes],
        expect.anything(), // fee
      );
    });
  });
});
