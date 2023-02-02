import { MsgAddReactionEncodeObject, MsgRemoveReactionEncodeObject } from '@desmoslabs/desmjs';
import { RegisteredReactionValue } from '@desmoslabs/desmjs-types/desmos/reactions/v1/models';
import {
  MsgAddReaction,
  MsgRemoveReaction,
} from '@desmoslabs/desmjs-types/desmos/reactions/v1/msgs';
import { convertRegisteredReactionValueToAny } from '@desmoslabs/desmjs/build/aminomessages/reactions';
import EnvConfig from 'config/EnvConfig';
import { GrantEnums } from 'lib/desmos/msgtypes';
import Long from 'long';
import { encodeAndBroadcastTx } from 'services/axios/requests/CentralizedBroadcastTx';

const addReaction = async ({ postId, user }: Partial<MsgAddReaction>) => {
  const reaction = convertRegisteredReactionValueToAny(
    RegisteredReactionValue.fromPartial({
      registeredReactionId: 9, // TODO use registered reactions
    }),
  );

  const msg: MsgAddReactionEncodeObject = {
    typeUrl: GrantEnums.MsgAddReaction,
    value: MsgAddReaction.fromPartial({
      subspaceId: EnvConfig.APP_SUBSPACE_ID,
      postId,
      value: reaction,
      user,
    }),
  };
  return encodeAndBroadcastTx({ msgs: [msg] });
};

const removeReaction = async ({ postId, user, reactionId }: Partial<MsgRemoveReaction>) => {
  const msg: MsgRemoveReactionEncodeObject = {
    typeUrl: GrantEnums.MsgRemoveReaction,
    value: MsgRemoveReaction.fromPartial({
      subspaceId: EnvConfig.APP_SUBSPACE_ID,
      postId,
      reactionId,
      user,
    }),
  };

  return encodeAndBroadcastTx({ msgs: [msg] });
};

// eslint-disable-next-line import/prefer-default-export
export const manageReaction = async ({
  postId,
  user,
  reactionId,
}: {
  postId: number;
  user: string;
  reactionId?: number;
}) => {
  if (reactionId) {
    console.log('remove reaction with ID: ', reactionId);
    return removeReaction({
      postId: Long.fromNumber(postId),
      user,
      reactionId,
    });
  } else {
    console.log('add reaction');
    return addReaction({ postId: Long.fromNumber(postId), user });
  }
};
