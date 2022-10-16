import {renderHook} from '@testing-library/react-native';
import useManageReactions from 'services/axios/requests/CentralizedBroadcastTx/useAddOrRemoveReaction/utils/useManageReactions';
import CentralizedBroadcastTx from 'services/axios/requests/CentralizedBroadcastTx';
import {GrantEnums} from 'lib/desmos/msgtypes';
import {
  MsgAddReaction,
  MsgRemoveReaction,
} from '@desmoslabs/desmjs-types/desmos/reactions/v1/msgs';
import EnvConfig from 'config/EnvConfig';
import {convertRegisteredReactionValueToAny} from '@desmoslabs/desmjs/build/aminomessages/reactions';
import {RegisteredReactionValue} from '@desmoslabs/desmjs-types/desmos/reactions/v1/models';

const mockEncodeToAmino = jest.fn(() => 'mockAminoEncodedMessage');
const mockCentralizedBroadcastTx = jest.fn();

jest.mock('services/axios/requests/CentralizedBroadcastTx');

jest.mock('@desmoslabs/desmjs', () => ({
  DesmosClient: {
    connect: () => ({
      encodeToAmino: mockEncodeToAmino,
    }),
  },
}));

const mockPostId = 1;
const mockUser = '123';

describe('hooks: useManageReactions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('adds a reaction', async () => {
    (CentralizedBroadcastTx as jest.Mock).mockImplementation(
      mockCentralizedBroadcastTx,
    );

    const {result} = renderHook(() => useManageReactions());

    await result.current.manageReaction({
      postId: mockPostId,
      user: mockUser,
    });

    const reaction = convertRegisteredReactionValueToAny(
      RegisteredReactionValue.fromPartial({
        registeredReactionId: 9, // TODO use registered reactions
      }),
    );

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

    expect(mockCentralizedBroadcastTx).toHaveBeenCalledWith({
      messages: 'mockAminoEncodedMessage',
    });
  });

  it('removes a reaction', async () => {
    const mockReactionId = 123;

    (CentralizedBroadcastTx as jest.Mock).mockImplementation(
      mockCentralizedBroadcastTx,
    );

    const {result} = renderHook(() => useManageReactions());

    await result.current.manageReaction({
      postId: mockPostId,
      user: mockUser,
      reactionId: mockReactionId,
    });

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

    expect(mockCentralizedBroadcastTx).toHaveBeenCalledWith({
      messages: 'mockAminoEncodedMessage',
    });
  });
});
