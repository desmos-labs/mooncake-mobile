import {GrantEnums} from 'lib/desmos/msgtypes';
import {
  MsgAddReaction,
  MsgRemoveReaction,
} from '@desmoslabs/desmjs-types/desmos/reactions/v1/msgs';
import EnvConfig from 'config/EnvConfig';
import {convertRegisteredReactionValueToAny} from '@desmoslabs/desmjs/build/aminomessages/reactions';
import {RegisteredReactionValue} from '@desmoslabs/desmjs-types/desmos/reactions/v1/models';
import axiosInstance from 'services/axios';
import {manageReaction} from 'services/axios/requests/CentralizedBroadcastTx/useAddOrRemoveReaction/utils';

const mockEncodeToAmino = jest.fn(() => 'mockAminoEncodedMessage');

jest.mock('@desmoslabs/desmjs', () => ({
  DesmosClient: {
    connect: () => ({
      encodeToAmino: mockEncodeToAmino,
      disconnect: () => true,
    }),
  },
}));

const mockCentralizedBroadcastTx = jest.fn();
jest.mock('services/axios/requests/CentralizedBroadcastTx', () => {
  const actual = jest.requireActual(
    'services/axios/requests/CentralizedBroadcastTx',
  );

  return {
    encodeAndBroadcastTx: actual.encodeAndBroadcastTx,
    CentralizedBroadcastTx: mockCentralizedBroadcastTx,
  };
});

jest.mock('services/axios');

const mockPostId = 1;
const mockUser = '123';

describe('hooks: useManageReactions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('adds a reaction', async () => {
    const mockTxHash = 'mockTxHash';
    (axiosInstance.post as jest.Mock).mockResolvedValueOnce({
      data: {tx_hash: mockTxHash},
    });

    await manageReaction({
      postId: mockPostId,
      user: mockUser,
    });

    const reaction = convertRegisteredReactionValueToAny(
      RegisteredReactionValue.fromPartial({
        registeredReactionId: 9, // TODO use registered reactions
      }),
    );

    // expect a proper MsgAddReaction message to be built
    expect(mockEncodeToAmino).toHaveBeenCalledWith([
      {
        typeUrl: GrantEnums.MsgAddReaction,
        value: MsgAddReaction.fromPartial({
          subspaceId: EnvConfig.APP_SUBSPACE_ID,
          postId: mockPostId,
          value: reaction,
          user: mockUser,
        }),
      },
    ]);

    expect(axiosInstance.post).toHaveBeenCalledWith('/broadcast', {
      messages: 'mockAminoEncodedMessage',
      memo: undefined,
    });
  });

  it('removes a reaction', async () => {
    const mockReactionId = 123;

    const mockTxHash = 'mockTxHash';
    (axiosInstance.post as jest.Mock).mockResolvedValueOnce({
      data: {tx_hash: mockTxHash},
    });

    await manageReaction({
      postId: mockPostId,
      user: mockUser,
      reactionId: mockReactionId,
    });
    // expect a proper MsgRemoveReaction message to be built
    expect(mockEncodeToAmino).toHaveBeenCalledWith([
      {
        typeUrl: GrantEnums.MsgRemoveReaction,
        value: MsgRemoveReaction.fromPartial({
          subspaceId: EnvConfig.APP_SUBSPACE_ID,
          postId: mockPostId,
          reactionId: mockReactionId,
          user: mockUser,
        }),
      },
    ]);

    expect(axiosInstance.post).toHaveBeenCalledWith('/broadcast', {
      messages: 'mockAminoEncodedMessage',
      memo: undefined,
    });
  });
});
