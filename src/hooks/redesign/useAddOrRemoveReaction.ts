import React from 'react';
import {useActiveAddress} from '@recoil/redesign/wallets';
import {
  useAddPostReaction,
  useHasPostReaction,
  useRemovePostReaction,
} from '@recoil/redesign/reactions';
import {PostID} from 'types/desmos';
import useBroadcastTx from 'hooks/redesign/useBroadcastTx';
import {
  MsgAddReactionEncodeObject,
  MsgAddReactionTypeUrl,
  MsgRemoveReactionEncodeObject,
  MsgRemoveReactionTypeUrl,
} from '@desmoslabs/desmjs';
import Long from 'long';
import {useLazyQuery} from '@apollo/client';
import GetPostReactionForAddress from 'services/graphql/queries/GetPostReactionForAddress';
import {convertRegisteredReactionValueToAny} from '@desmoslabs/desmjs/build/aminomessages/reactions';
import useAppConfig from 'hooks/redesign/useAppConfig';

/**
 * Hook that allows to add a reaction both remotely and locally.
 */
const useAddReaction = () => {
  const config = useAppConfig();
  const broadcastTx = useBroadcastTx();
  const addPostReaction = useAddPostReaction();

  const [getReaction] = useLazyQuery(GetPostReactionForAddress, {
    fetchPolicy: 'network-only',
  });

  return React.useCallback(
    async (postId: PostID, address: string) => {
      // Add the reaction locally
      addPostReaction(address, postId);

      // Check if the reaction exists on the server
      const {data} = await getReaction({
        variables: {
          postId,
          userAddress: address,
        },
      });

      const hasReaction = data?.reactions?.length > 0;
      if (!hasReaction) {
        // If the reaction does not exist on the server, add it there
        const messageAddReaction: MsgAddReactionEncodeObject = {
          typeUrl: MsgAddReactionTypeUrl,
          value: {
            subspaceId: config.subspaceId,
            postId: Long.fromNumber(postId),
            value: convertRegisteredReactionValueToAny({
              registeredReactionId: config.registeredReactionId,
            }),
            user: address,
          },
        };

        // Broadcast the transaction
        // TODO: Handle if broadcastTx returns an error, deleting the added reaction
        await broadcastTx([messageAddReaction], {optimistic: true});
      }
    },
    [config, getReaction, broadcastTx, addPostReaction],
  );
};

/**
 * Hook that allows to remove a reaction both remotely (if present) and locally.
 */
const useRemoveReaction = () => {
  const config = useAppConfig();
  const broadcastTx = useBroadcastTx();
  const removePostReaction = useRemovePostReaction();

  const [getReaction] = useLazyQuery(GetPostReactionForAddress, {
    fetchPolicy: 'network-only',
  });

  return React.useCallback(
    async (postId: PostID, address: string) => {
      // Remove the reaction locally
      removePostReaction(address, postId);

      // Get the reaction id from the server
      const {data} = await getReaction({
        variables: {
          postId,
          userAddress: address,
        },
      });

      const reactions = data?.reactions;
      const reactionId = reactions?.length > 0 ? reactions[0].id : undefined;

      // If the reaction id is defined, delete it remotely
      if (reactionId) {
        const messageRemoveReaction: MsgRemoveReactionEncodeObject = {
          typeUrl: MsgRemoveReactionTypeUrl,
          value: {
            subspaceId: config.subspaceId,
            postId: Long.fromNumber(postId),
            reactionId,
            user: address,
          },
        };

        // Broadcast the transaction
        // TODO: Handle if the broadcast returns an error, re-adding the removed reaction
        await broadcastTx([messageRemoveReaction], {optimistic: true});
      }
    },
    [config, getReaction, broadcastTx, removePostReaction],
  );
};

/**
 * Hook that allows to add or remove a reaction to a post having a given id.
 */
const useAddOrRemoveReaction = () => {
  const activeAddress = useActiveAddress();
  if (!activeAddress) {
    throw new Error(
      'Trying to know add or remove a reaction, without active user',
    );
  }

  const hasPostReaction = useHasPostReaction();
  const addReaction = useAddReaction();
  const removeReaction = useRemoveReaction();

  return React.useCallback(
    async (postId: PostID) => {
      const doesReactionExist = hasPostReaction(activeAddress, postId);
      if (doesReactionExist) {
        await removeReaction(postId, activeAddress);
      } else {
        await addReaction(postId, activeAddress);
      }
    },
    [hasPostReaction, addReaction, removeReaction],
  );
};

export default useAddOrRemoveReaction;
