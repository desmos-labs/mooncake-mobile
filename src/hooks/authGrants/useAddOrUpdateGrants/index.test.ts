import {timestampFromDate} from '@desmoslabs/desmjs';
import {GenericSubspaceAuthorization} from '@desmoslabs/desmjs-types/desmos/subspaces/v3/authz/authz';
import {Any} from '@desmoslabs/desmjs-types/google/protobuf/any';
import {genericSubspaceAuthorizationToAny} from '@desmoslabs/desmjs/build/aminomessages/subspaces/authorizations';
import {act, renderHook, waitFor} from '@testing-library/react-native';
import EnvConfig from 'config/EnvConfig';
import {MsgGrant, MsgRevoke} from 'cosmjs-types/cosmos/authz/v1beta1/tx';
import {
  AllowedMsgAllowance,
  BasicAllowance,
} from 'cosmjs-types/cosmos/feegrant/v1beta1/feegrant';
import {
  MsgGrantAllowance,
  MsgRevokeAllowance,
} from 'cosmjs-types/cosmos/feegrant/v1beta1/tx';
import useAddOrUpdateGrants from 'hooks/authGrants/useAddOrUpdateGrants/index';
import {
  buildGrantAllowanceEncode,
  buildGrantMsgEncodes,
  buildRevokeAllowanceEncode,
  buildRevokeGrantMsgEncodes,
} from 'hooks/authGrants/useAddOrUpdateGrants/utils';
import useUnlockWallet from 'hooks/useUnlockWallet';
import {GrantEnums} from 'lib/desmos/msgtypes';
import Long from 'long';
import {useGetAuthzGrants} from 'services/graphql/queries/GetAuthGrants';

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

let mockBroadcastMessages = jest.fn(() => true);

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

const mockRevokeAllowanceEncode = {
  typeUrl: '/cosmos.feegrant.v1beta1.MsgRevokeAllowance',
  value: MsgRevokeAllowance.fromPartial({
    grantee: mockGrantee,
    granter: mockGranter,
  }),
};

const mockRevokeGrantMsgEncodes = [
  {
    typeUrl: '/cosmos.authz.v1beta1.MsgRevoke',
    value: MsgRevoke.fromPartial({
      grantee: mockGrantee,
      granter: mockGranter,
      msgTypeUrl: mockGrants[0],
    }),
  },
];

describe('hooks: useAddOrUpdateGrants', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addOrUpdateGrants', () => {
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
        );
      });
    });

    it('throws an error if wallet failed to unlock', async () => {
      // simulate a user who is requesting MsgCreatePost grants for the first time
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

      (useUnlockWallet as jest.Mock).mockReturnValue((_: any) => undefined);

      const {result} = renderHook(() => useAddOrUpdateGrants());

      try {
        await result.current.addOrUpdateGrants({grantsToRequest: []});
      } catch (err: any) {
        expect(err.message).toBe(
          'Error unlocking wallet or user cancelled authentication',
        );
      }
    });

    it('throws an error if the tx fails to broadcast', async () => {
      // simulate a user who is requesting MsgCreatePost grants for the first time
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

      (useUnlockWallet as jest.Mock).mockReturnValue((_: any) => ({
        wallet: true,
      }));

      // @ts-ignore
      mockBroadcastMessages = jest.fn(() => undefined);

      const {result} = renderHook(() => useAddOrUpdateGrants());

      try {
        await result.current.addOrUpdateGrants({grantsToRequest: []});
      } catch (err: any) {
        console.log(err.messages);
        expect(err.message).toBe('Error requesting grants');
      }
    });
  });

  describe('revokeAllGrants', () => {
    it('successfully revokes all grants from chain', async () => {
      // simulate a user who is requesting MsgCreatePost grants for the first time
      (useGetAuthzGrants as jest.Mock).mockReturnValue({
        getAuthzGrants: () => ({
          has_fee_grant: false,
          grants: [{}],
        }),
      });

      (buildRevokeGrantMsgEncodes as jest.Mock).mockReturnValue(
        mockRevokeGrantMsgEncodes,
      );

      (buildRevokeAllowanceEncode as jest.Mock).mockReturnValue(
        mockRevokeAllowanceEncode,
      );

      (useUnlockWallet as jest.Mock).mockReturnValue((_: any) => ({
        wallet: true,
      }));

      const {result} = renderHook(() => useAddOrUpdateGrants());

      act(() => {
        result.current.revokeAllGrants();
      });

      await waitFor(() => {
        expect(mockBroadcastMessages).toHaveBeenCalledWith(
          expect.anything(), // wallet
          [mockRevokeAllowanceEncode, ...mockRevokeGrantMsgEncodes],
          // expect.anything(), // fee
        );
      });
    });
  });
});
