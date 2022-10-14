import {
  DesmosClient,
  MsgAddReactionEncodeObject,
  MsgRemoveReactionEncodeObject,
} from '@desmoslabs/desmjs';
import {RegisteredReactionValue} from '@desmoslabs/desmjs-types/desmos/reactions/v1/models';
import {
  MsgAddReaction,
  MsgRemoveReaction,
} from '@desmoslabs/desmjs-types/desmos/reactions/v1/msgs';
import {convertRegisteredReactionValueToAny} from '@desmoslabs/desmjs/build/aminomessages/reactions';
import EnvConfig from 'config/EnvConfig';
import {GrantEnums} from 'lib/desmos/msgtypes';
import Long from 'long';
import React, {useCallback} from 'react';
import CentralizedBroadcastTx from 'services/axios/requests/CentralizedBroadcastTx';

/**
 * Hook that manange a reaction, adding or removing it.
 * Consider using the useAddOrRemoveReaction hook for an all-in-one hook that requests grants and handles adding/removing reactions.
 */
const useManageReactions = () => {
  const addReaction = React.useCallback(
    async ({postId, user}: Partial<MsgAddReaction>) => {
      const reaction = convertRegisteredReactionValueToAny(
        RegisteredReactionValue.fromPartial({
          registeredReactionId: 9, // TODO use registered reactions
        }),
      );

      try {
        const client = await DesmosClient.connect(EnvConfig.DESMOS_RPC);

        const msg: MsgAddReactionEncodeObject = {
          typeUrl: GrantEnums.MsgAddReaction,
          value: MsgAddReaction.fromPartial({
            subspaceId: EnvConfig.APP_SUBSPACE_ID,
            postId,
            value: reaction,
            user,
          }),
        };

        const aminoEncodedMsg = client.encodeToAmino([msg]);

        return await CentralizedBroadcastTx({
          messages: aminoEncodedMsg,
        });
      } catch (err: any) {
        throw new Error(err.toString());
      }
    },
    [],
  );

  const removeReaction = React.useCallback(
    async ({postId, user, reactionId}: Partial<MsgRemoveReaction>) => {
      try {
        const client = await DesmosClient.connect(EnvConfig.DESMOS_RPC);

        const msg: MsgRemoveReactionEncodeObject = {
          typeUrl: GrantEnums.MsgRemoveReaction,
          value: MsgRemoveReaction.fromPartial({
            subspaceId: EnvConfig.APP_SUBSPACE_ID,
            postId,
            reactionId,
            user,
          }),
        };

        const aminoEncodedMsg = client.encodeToAmino([msg]);

        return await CentralizedBroadcastTx({
          messages: aminoEncodedMsg,
        });
      } catch (err: any) {
        throw new Error(err.toString());
      }
    },
    [],
  );

  /**
   * Add or remove a reaction depending on whether the active user has already reacted to the post.
   *
   * @param {number} postId The ID of the post
   * @param {string} user The address of the user managing the reaction
   * @param {number} reactionId (OPTIONAL, required only for removing a reaction) The ID of the reaction to be removed
   * */
  const manageReaction = useCallback(
    async ({
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
        return addReaction({postId: Long.fromNumber(postId), user});
      }
    },
    [],
  );

  return {manageReaction};
};

export default useManageReactions;
